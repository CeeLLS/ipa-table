// import React, { useEffect } from 'react';
import {TableContainer, Table, TableHead, TableRow, TableCell, TableBody} from '@mui/material';
import characters from './characters.json';

const CustomTable = ({ data }) => {
    const columns = ['Bilabial', 'Labio-dental', 'Dental', 'Alveolar', 'Postalveolar', 'Retroflex', 'Palatal', 'Velar', 'Uvular', 'Pharyngeal', 'Glottal'];
    const rows = ['Plosive', 'Nasal', 'Trill', 'Tap', 'Fricative', 'Lateral fricative', 'Aproximant', 'Lateral approximant'];
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

    const subRows = (row) => { //determina qunatos subrows devem existir 
        const res = []
        const log = {}
        characters.forEach((item) => {
            const dia = ['']
            if(item.diacritics.length > 0){
                dia.push(...item.diacritics);
                
                //fazer dicionário que calcula todas as subrows necessárias

                // rows.push(item.manner);
                // rows.splice(rows.indexOf(item.manner)+1, 0, item.manner);
                addSubRow(item)
                // se há mais de um conflitante será preenchido com mais de uma linha 
            }
            res.unshift(...dia);
            // console.log(res);
            if(dia.length > 0 && columns[0] !== ' ')
                columns.unshift(' ');
            // spamar os campos n utilizados
                // res.push(...item.diacritics);
                // ' '.push(columns);
        });
        return res.reverse();
    };

    const addSubRow = (item)  => {
        rows.splice(rows.indexOf(item.manner)+1, 0, item.manner);
    };

    subRows(row)
    // const auxRow = subRows();
    // console.log(auxRow);


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
                            <TableCell>
                                {row} 
                            </TableCell>
                                {columns.map((column, columnIndex) => (
                                    <TableCell key={columnIndex}> 
                                    {columnIndex === 0 ? auxRow[index] : getChar(`${row}`, `${column}`, `${auxRow[index]}`)} 
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