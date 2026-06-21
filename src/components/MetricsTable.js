import React from 'react';

const MetricsTable = ({ logs }) => (
  <table border="1" style={{ width: '100%', marginTop: '20px' }}>
    <thead>
      <tr><th>Date</th><th>Weight</th><th>BP</th></tr>
    </thead>
    <tbody>
      {logs.map((log, index) => (
        <tr key={index}>
          <td>{log.date}</td><td>{log.weight}</td><td>{log.bp}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default MetricsTable;