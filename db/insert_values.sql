/* INSERT VALUES */


use Resultify;
insert into UserRol(name,description) values('admin','admin');
insert into UserRol(name,description) values('teacher','teacher');
insert into UserRol(name,description) values('student','student');
select * from UserRol;

insert into Users(email,password_hash,rol_id) values('humberto.salastnr@uanl.edu.mx','$2a$12$kdLhFcRMTazRgWhTn0vs9O9QIokPa.Udgic6qNO9Vour/xAiYkndW',1);
insert into UserProfiles (user_id,student_id,first_name,last_name) values(1,1806610,'Humberto Hiram','Salas Tenorio');
                            
insert into ExamType(name,description) values ('general','general');
insert into QuestionType(name,description) values ('general','general');