	use Resultify;
	drop view if exists vShowUsers;
	create view vShowUsers  as
			select
				Users.id,
				Users.email,
				Users.is_active,
                UserRol.name as userRol,
                UserProfiles.student_id,
				UserProfiles.first_name,
				UserProfiles.last_name,
				UserProfiles.phone_number
			from Users
			left join UserRol on Users.rol_id = UserRol.id
			left join UserProfiles on UserProfiles.user_id = Users.id;
		

	drop view if exists vShowExams;
    create view vShowExams as
			select 
				Exams.id,
                Exams.title,
                Exams.description,
                Exams.school_group,
                Exams.school_career,
                Users.id as autor_id,
                UserProfiles.id as user_info_id,
                concat(UserProfiles.first_name , ' ' , UserProfiles.last_name) as autor,
                Exams.is_active
			from Exams
			left join Users on Exams.created_by = Users.id
            left join UserProfiles on UserProfiles.user_id = Users.id;
            
			
	drop view if exists vShowActiveExams;
	create view vShowActiveExams as
			select 
				Exams.id,
                Exams.title
                from exams
                where Exams.is_active = 1;
				
                
	
 
 