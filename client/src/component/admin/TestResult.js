import React, { useState, useEffect } from "react";
import axios from "axios";

function TestResult() {
  const [isLoading, setIsLoading] = useState(true);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/test-result");
        const testResultsData = response.data;

        const updatedTestResults = await Promise.all(
          testResultsData.map(async (result) => {
            try {
              // Fetch test details for each test result
              const testResponse = await axios.get(
                `/get-test-details/${result.testId}`
              );
              const testData = testResponse.data;

              return {
                ...result,
                subjectName: testData.subjectName,
                subjectCode: testData.subjectCode,
              };
            } catch (testError) {
              console.error(
                `Error fetching test details for testId ${result.testId}:`,
                testError
              );
              // Handle test details fetching error (e.g., set default values)
              return {
                ...result,
                subjectName: "N/A",
                subjectCode: "N/A",
              };
            }
          })
        );

        setTestResults(updatedTestResults);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching test results:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteTestSubmission = async (testSubmissionId) => {
    try {
      await axios.delete(`/delete-test-submission/${testSubmissionId}`);
      // Filter out the deleted test submission from the current state
      const updatedTestResults = testResults.filter(
        (result) => result._id !== testSubmissionId
      );
      setTestResults(updatedTestResults);
    } catch (error) {
      console.error(
        `Error deleting test submission with ID ${testSubmissionId}:`,
        error
      );
    }
  };

  return (
    <div>
      <h3 className="table-heading">Test Results</h3>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="testResultList">
          <table className="table">
            <thead className="testResultThead">
              <tr>
                <th>Sr</th>
                {/* <th>Test ID</th> */}
                <th>Subject Code</th>
                <th>Subject Name</th>
                {/* <th>Student ID</th> */}
                <th>Student Name</th>
                <th>Total Marks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {testResults.map((result) => (
                <tr key={result._id}>
                  <td>{testResults.indexOf(result) + 1}</td>
                  {/* <td>{result.testId}</td> */}
                  <td>{result.subjectCode}</td>
                  <td>{result.subjectName}</td>
                  {/* <td>{result.studentId}</td> */}
                  <td>{result.studentName}</td>
                  <td>{result.totalMarks}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteTestSubmission(result._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TestResult;
