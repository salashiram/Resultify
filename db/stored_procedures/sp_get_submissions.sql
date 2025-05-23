	use Resultify;
	drop procedure if exists spGetSubmissions;
	delimiter //
	create procedure spGetSubmissions 
	(
		in exam_id_p int
	)
		begin
			SELECT 
			  Submissions.id AS id,
			  Submissions.student_name AS alumno,
			  Submissions.student_id AS matricula,
			  Submissions.score AS calificacion,
			  Submissions.exam_id AS id_exam,
			  Exams.title AS examen,
			  Exams.description AS description
			FROM Submissions
			INNER JOIN Exams ON Submissions.exam_id = Exams.id
			WHERE Submissions.exam_id = exam_id_p;
		end //
	delimiter ;
    
    
 
    
    