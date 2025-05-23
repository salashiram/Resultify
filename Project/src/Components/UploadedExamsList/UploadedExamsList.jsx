import "./UploadedExamsList.css";

const UploadedExamsList = ({ exams, loading }) => {
  if (loading) {
    return <div>Cargando exámenes...</div>;
  }

  return (
    <div>
      <div className="exams-list-container">
        <div className="exams-list-content">
          <h2>Exámenes cargados</h2>
          {exams.length === 0 ? (
            <p>No hay exámenes cargados.</p>
          ) : (
            <ul>
              {exams.map((exam, index) => (
                <li key={index}>{exam}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadedExamsList;
