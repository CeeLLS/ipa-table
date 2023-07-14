import React from 'react';
import { useTable, useGroupBy } from 'react-table';
import characters from './characters.json';



const places = [...new Set(characters.flatMap((characters) => characters.place))];
const columns = [
  {
    Header: '',
    accessor: 'rows',
  },
  {
    Header: '',
    accessor: 'subRow',
  },
  ...places.map((place) => ({
    Header: place,
    accessor: place,
  })),
];

const rows = [
  'Plosive',
  'Nasal',
  'Trill',
  'Tap',
  'Fricative',
  'Lateral fricative',
  'Approximant',
  'Lateral approximant',
];

// const rows = []
// const subRows = []

// characters.forEach((c) => {
//   c.manner.forEach((m) => {
//     if (!rows.includes(m)) {
//       rows.push(m);
//     }
//   });

//   if (c.submanner && !subRows.includes(c.submanner)) {
//     subRows.push(c.submanner);
//     rows.push('');
//   }
// });

// rows = rows.reduce((acc, val, index) => {
//   acc.push(val);
//   acc.push(subRows[index]);
// });

const data = rows.map((row) => { // função horrivel
  const rowData = { rows: row };
  columns.forEach((column) => {
    const header = column.Header;
    const matches = characters.filter((character) => {
      return character.place.includes(header) && character.manner.includes(row);
    });

    if (matches.length > 0) {
      rowData[header] = matches.map((match) => match.char);
    } else {
      rowData[header] = '';
    }
    console.log('c:', header, 'r:', row, 'd:', rowData[column])
    
  });
  return rowData;
});

const MainTable = () => {

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <table {...getTableProps()} className="table">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} className="table-header">
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()} className="table-body">
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} className="table-row">
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default MainTable;
