// import React, { useEffect } from 'react';
import {TableContainer, Table, TableHead, TableRow, TableCell, TableBody} from '@mui/material';
import characters from './characters.json';

const CustomTable = ({ data }) => {
    const columns = ["A", "B", "C"]
    const subcColumns = ["A"]
    const rows = ["A", "B", "B"]
    const subRows = ["A"]
    // const columns = ['Bilabial', 'Labio-dental', 'Dental', 'Alveolar', 'Postalveolar', 'Retroflex', 'Palatal', 'Velar', 'Uvular', 'Pharyngeal', 'Glottal'];
    // const rows = ['Plosive', 'Nasal', 'Trill', 'Tap', 'Fricative', 'Lateral fricative', 'Aproximant', 'Lateral approximant'];
// talvez a função pode ler tudo no js primeiro e dps criar a tabela, otimizando ela
// ou criar td de uma vez e esconder o que não importa dps, o processo inverso do que foi dit acima
//posso só manipular a lista e recarregar o DOM

    const getChar = (row, column, diacritic) => {
        const res = characters.filter((item) => item.place.includes(`${column}`) && 
                                                item.manner.includes(`${row}`) &&
                                                (diacritic === "" || item.diacritics.includes(diacritic)) );
        // console.log(characters)
        if(res.length > 0)
            return res[0].char;
        return '';
    };

    // const subRows = (row) => { //determina qunatos subrows devem existir 
    //     const res = []
    //     const log = {}
    //     characters.forEach((item) => {
    //         const dia = ['']
    //         if(item.diacritics.length > 0){
    //             dia.push(...item.diacritics);
                
    //             //fazer dicionário que calcula todas as subrows necessárias

    //             // rows.push(item.manner);
    //             // rows.splice(rows.indexOf(item.manner)+1, 0, item.manner);
    //             addSubRow(item)
    //             // se há mais de um conflitante será preenchido com mais de uma linha 
    //         }
    //         res.unshift(...dia);
    //         // console.log(res);
    //         if(dia.length > 0 && columns[0] !== ' ')
    //             columns.unshift(' ');
    //         // spamar os campos n utilizados
    //             // res.push(...item.diacritics);
    //             // ' '.push(columns);
    //     });
    //     return res.reverse();
    // };

    const rowsNColumns = () => { // generalizar dps
        const rowDict = {}
        const columnDict = {}
        characters.array.forEach(element => {
            if (!rowDict.includes(element.manner))
                rowDict[element.manner] = [...element.submanner]
            else {
                let missing = element.submanner.filter((e) => !rowDict[element.manner].includes(e)) 
                rowDict[element.manner].push(...missing)
            }
                 

            if (!columnDict.includes(element.place))
                columnDict[element.place] = [...element.subplace]
            else {
                let missing = element.subplace.filter((e) => !columnDict[element.place].includes(e)) 
                columnDict[element.place].push(...missing)
            }
        });
        console.log(rowDict, columnDict)
        return rowDict, columnDict;
    };

    const addSubRow = (item)  => {
        rows.splice(rows.indexOf(item.manner)+1, 0, item.manner);
    };

    // subRows(row)
    // const subManner = subRows();
    rowsNColumns()

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        {/* <TableCell></TableCell>quando um campo for adicionado */}
                        {columns.map((column, index) =>(
                            <TableCell key={index}>{column}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell> {row} </TableCell>
                                {columns.map((column, columnIndex) => (
                                    <TableCell key={columnIndex}> 
                                    {/* {columnIndex === 0 ? auxRow[index] : getChar(`${row}`, `${column}`, `${auxRow[index]}`)}  */}
                                    {getChar(`${row}`, `${column}`)}
                                    </TableCell>
                                ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CustomTable;