USE Resultify;
DELIMITER $$
DROP PROCEDURE IF EXISTS get_exam_by_id;
CREATE PROCEDURE get_exam_by_id(IN examId INT)
BEGIN
  -- Examen
  SELECT 
    e.id,
    e.title,
    e.description,
    e.exam_type_id,
    e.school_group,
    e.school_career
  FROM exams e
  WHERE e.id = examId;

  -- Preguntas del examen
  SELECT 
    q.id AS question_id,
    q.exam_id,
    q.question_number,
    q.question_text,
    q.score_value
  FROM questions q
  WHERE q.exam_id = examId;

  -- Opciones de cada pregunta
  SELECT 
    o.id AS option_id,
    o.question_id,
    o.option_text,
    o.is_correct
  FROM options o
  WHERE o.question_id IN (
    SELECT id FROM questions WHERE exam_id = examId
  );
END $$

DELIMITER ;


 
 