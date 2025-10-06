use std::env;

use log::{info};
use poem::{
    endpoint::{StaticFileEndpoint, StaticFilesEndpoint}, error::ResponseError, get, handler, http::StatusCode, listener::TcpListener, patch, web::{Data, Json, Path}, EndpointExt, Route, Server
};
use serde::{Deserialize, Serialize};
use sqlx::{SqlitePool};
use ulid::Ulid;

#[derive(Debug, thiserror::Error)]
enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error(transparent)]
    Sqlx(#[from] sqlx::Error),
    #[error(transparent)]
    Var(#[from] std::env::VarError),
    #[error(transparent)]
    Dotenv(#[from] dotenv::Error),
}

impl ResponseError for Error {
    fn status(&self) -> StatusCode {
        StatusCode::INTERNAL_SERVER_ERROR
    }
}

async fn connect_db() -> Result<SqlitePool, Error> {
    let pool = SqlitePool::connect(&env::var("DATABASE_URL")?).await?;
    Ok(pool)
}

#[derive(Serialize, Deserialize, Debug)]
struct IntakeFormData {
    id: Option<String>,
    email: Option<String>,
    submitted_at: Option<String>,
    reasons_for_therapy: Option<Vec<String>>,
    goals_in_therapy: Option<Vec<String>>,
    age_group: Option<String>,
    therapist_knowledge: Option<Vec<String>>,
    therapist_gender: Option<String>,
    session_activeness: Option<String>,
}



// Database Layer

fn serialize_string_vec(str_vec: Option<&Vec<String>>) -> Option<String> {
    str_vec.map(|s| s.join(";"))
}

fn deserialize_string_vec(str: Option<String>) -> Option<Vec<String>> {
    if let Some(str) = str {
        if str.contains(";") {
            return Some(str.split(";").map(|s| s.to_string()).collect());
        }
        else {
            return Some(vec![]);
        }
    }

    None
}

async fn insert_intake_form(db: &SqlitePool, intake_form: &IntakeFormData) -> Result<String, Error> {
    let form_id = Ulid::new().to_string();

    let reasons_for_therapy = serialize_string_vec(intake_form.reasons_for_therapy.as_ref());
    let goals_in_therapy = serialize_string_vec(intake_form.goals_in_therapy.as_ref());
    let therapist_knowledge = serialize_string_vec(intake_form.therapist_knowledge.as_ref());

    sqlx::query!(
        "INSERT INTO intake_forms VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);", 
        form_id, 
        intake_form.email, 
        intake_form.submitted_at, 
        reasons_for_therapy, 
        goals_in_therapy, 
        intake_form.age_group, 
        therapist_knowledge, 
        intake_form.therapist_gender, 
        intake_form.session_activeness
    ).execute(db).await?;

    Ok(form_id)
}

async fn update_intake_form(db: &SqlitePool, form_id: &String, changes: &IntakeFormData) -> Result<bool, Error> {
    let reasons_for_therapy = serialize_string_vec(changes.reasons_for_therapy.as_ref());
    let goals_in_therapy = serialize_string_vec(changes.goals_in_therapy.as_ref());
    let therapist_knowledge = serialize_string_vec(changes.therapist_knowledge.as_ref());

    sqlx::query!(
        r#"UPDATE intake_forms SET 
        email = COALESCE($2, email), 
        submitted_at = COALESCE($3, submitted_at),
        reasons_for_therapy = COALESCE($4, reasons_for_therapy), 
        goals_in_therapy = COALESCE($5, goals_in_therapy), 
        age_group = COALESCE($6, age_group), 
        therapist_knowledge = COALESCE($7, therapist_knowledge), 
        therapist_gender = COALESCE($8, therapist_gender), 
        session_activeness = COALESCE($9, session_activeness)
         WHERE id = $1;"#, 
        form_id, 
        changes.email, 
        changes.submitted_at, 
        reasons_for_therapy, 
        goals_in_therapy, 
        changes.age_group, 
        therapist_knowledge, 
        changes.therapist_gender, 
        changes.session_activeness
    ).execute(db).await?;

    Ok(true)
}

async fn get_intake_form(db: &SqlitePool, form_id: &String) -> Result<IntakeFormData, Error> {
    let row = sqlx::query!("SELECT * FROM intake_forms WHERE id = $1;", form_id)
        .fetch_one(db).await?;

    Ok(IntakeFormData { 
        id: row.id, 
        email: row.email, 
        submitted_at: row.submitted_at, 
        age_group: row.age_group, 
        goals_in_therapy: deserialize_string_vec(row.goals_in_therapy),
        reasons_for_therapy: deserialize_string_vec(row.reasons_for_therapy), 
        session_activeness: row.session_activeness, 
        therapist_gender: row.therapist_gender, 
        therapist_knowledge: deserialize_string_vec(row.therapist_knowledge)
    })
}

async fn get_all_intake_forms(db: &SqlitePool) -> Result<Vec<IntakeFormData>, Error> {
    let rows = sqlx::query!("SELECT * FROM intake_forms;").fetch_all(db).await?;
    let mut intake_forms: Vec<IntakeFormData> = vec![];

    for row in rows {
        intake_forms.push(IntakeFormData { 
            id: row.id, 
            email: row.email, 
            submitted_at: row.submitted_at, 
            age_group: row.age_group, 
            goals_in_therapy: deserialize_string_vec(row.goals_in_therapy),
            reasons_for_therapy: deserialize_string_vec(row.reasons_for_therapy), 
            session_activeness: row.session_activeness, 
            therapist_gender: row.therapist_gender, 
            therapist_knowledge: deserialize_string_vec(row.therapist_knowledge)
        });
    }

    Ok(intake_forms)
}



// API Layer

#[derive(Serialize, Deserialize, Debug)]
struct ListIntakeFormsResponse {
    data: Vec<IntakeFormData>
}


#[handler]
async fn list_intake_forms(
    Data(db): Data<&SqlitePool>,
) -> Result<Json<ListIntakeFormsResponse>, Error> {
    let intake_forms = get_all_intake_forms(db).await?;
    Ok(Json(ListIntakeFormsResponse { data: intake_forms }))
}

#[derive(Serialize, Deserialize, Debug)]
struct CreateIntakeFormResponse {
    data: IntakeFormData
}

#[handler]
async fn post_intake_form(
    Data(db): Data<&SqlitePool>,
    Json(body): Json<IntakeFormData>
) -> Result<Json<CreateIntakeFormResponse>, Error> {
    let form_id = insert_intake_form(db, &body).await?;
    let saved_form_data = get_intake_form(db, &form_id).await?;
    Ok(Json(CreateIntakeFormResponse { data: saved_form_data }))
}


#[derive(Serialize, Deserialize, Debug)]
struct UpdateIntakeFormResponse {
    data: IntakeFormData
}

#[handler]
async fn patch_intake_form(
    Data(db): Data<&SqlitePool>,
    Path(form_id): Path<String>,
    Json(body): Json<IntakeFormData>
) -> Result<Json<UpdateIntakeFormResponse>, Error> {
    let saved_form_data = get_intake_form(db, &form_id).await?;

    if saved_form_data.submitted_at.is_some() {
        // Don't update
        return Ok(Json(UpdateIntakeFormResponse { data: saved_form_data }));
    }

    update_intake_form(db, &form_id, &body).await?;
    let updated_form_data = get_intake_form(db, &form_id).await?;
    Ok(Json(UpdateIntakeFormResponse { data: updated_form_data }))
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    dotenv::dotenv()?;
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    info!("Initialize db pool");
    let db  = connect_db().await?;

    let app = Route::new()
        .at("/api/intake-forms", get(list_intake_forms).post(post_intake_form))
        .at("/api/intake-forms/:form_id", patch(patch_intake_form))
        .at("/favicon.ico", StaticFileEndpoint::new("www/favicon.ico"))
        .nest("/static/", StaticFilesEndpoint::new("www"))
        .at("*", StaticFileEndpoint::new("www/index.html"))
        .data(db);

    Server::new(TcpListener::bind("0.0.0.0:3005"))
        .run(app)
        .await?;

    Ok(())
}
