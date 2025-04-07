	drop database if exists Resultify;
	create database Resultify;
	use Resultify;

	drop table if exists Users; 
	create table Users (
	 id int primary key AUTO_INCREMENT,
	 email varchar(255) unique not null,
	 password_hash varchar(255) not null,
	 rol_id int not null,
	 is_active bool default(1),
	 createdAt timestamp default current_timestamp,
	 updatedAt datetime default current_timestamp on update current_timestamp  
	);

	drop table if exists UserRol;
	create table UserRol(
	id int primary key AUTO_INCREMENT,
	name varchar(255) not null,
	description varchar(255) not null,
	is_active bool default(1),
	createdAt timestamp default current_timestamp,
	updatedAt datetime default current_timestamp on update current_timestamp  
	);

	drop table if exists UserProfiles;
	create table UserProfiles(
	id int primary key AUTO_INCREMENT,
	user_id int not null,
	student_id int unique not null, 
	first_name varchar(255) not null,
	last_name varchar(255) not null,
	phone_number varchar(20),
	createdAt timestamp default current_timestamp,
	updatedAt datetime default current_timestamp on update current_timestamp  
	);

	drop table if exists Exams;
	create table Exams(
	id int primary key AUTO_INCREMENT,
	title varchar(255) not null,
	description varchar(255) not null,
	exam_type_id int default 1,
	school_group varchar(255) not null,
	school_career varchar(255) not null,
	created_by int not null,
	is_active bool default(1),
	createdAt timestamp default current_timestamp,
	updatedAt datetime default current_timestamp on update current_timestamp  
	);

	drop table if exists Questions;
	create table Questions(
	id int primary key AUTO_INCREMENT,
	exam_id int not null,
	question_text text not null,
	question_type_id int default 1,
	createdAt timestamp default current_timestamp,
	updatedAt datetime default current_timestamp on update current_timestamp  
	);

	drop table if exists Options;
	create table Options(
	id int primary key AUTO_INCREMENT,
	question_id int not null,
	option_text varchar(255) not null,
	is_correct bool default 0,
	createdAt timestamp default current_timestamp,
	updatedAt datetime default current_timestamp on update current_timestamp  
	);

	drop table if exists ExamType;
	create table ExamType(
	id int primary key AUTO_INCREMENT,
	name varchar(255) not null,
	description varchar(255) not null,
	is_active bool default(1),
	createdAt timestamp default current_timestamp,
	updatedAt datetime default current_timestamp on update current_timestamp  
	);

	drop table if exists QuestionType;
	create table QuestionType(
	id int primary key AUTO_INCREMENT,
	name varchar(255) not null,
	description varchar(255) not null,	
    is_active bool default(1),
	createdAt timestamp default current_timestamp,
	updatedAt datetime default current_timestamp on update current_timestamp  
	);
    

	drop table if exists Submissions;
    create table Submissions(
    id int primary key AUTO_INCREMENT,
    exam_id int not null,
    student_id int not null,
    student_name varchar(255) not null,
    is_active bool default 1,
    score decimal(10,2) not null,
	createdAt timestamp default current_timestamp,
	updatedAt datetime default current_timestamp on update current_timestamp 
    );
    

	drop table if exists Answers;
    create table Answers(
    id int primary key AUTO_INCREMENT,
    submission_id int not null,
    question_id int not null,
    is_correct bool default(1),
    is_active bool default(1)
    );

	/* CONSTRAINTS */

	alter table Users
		add constraint fk_user_rol foreign key (rol_id) references UserRol(id);
		
		
	alter table UserProfiles
		add constraint fk_user_profiles foreign key (user_id) references Users(id);
		
		
	alter table Exams 
		add constraint fk_exam_type foreign key (exam_type_id) references ExamType(id);
		
		
	alter table Questions 
		add constraint fk_question_type foreign key (question_type_id) references QuestionType(id);
		
		
	alter table Questions 
		add constraint fk_exam_question foreign key (exam_id) references Exams(id);
		

	alter table Options
		add constraint fk_question_option foreign key (question_id) references Questions(id);
        
	alter table Submissions
		add constraint fk_submission_exam foreign key (exam_id) references Exams(id);
        
	alter table Answers
		add constraint fk_answers_submissions foreign key (submission_id) references Submissions(id);
		
	alter table Answers 
		add constraint fk_answers_questions foreign key (question_id) references Questions(id);





