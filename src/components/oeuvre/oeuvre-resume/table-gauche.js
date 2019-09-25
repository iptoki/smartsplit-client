import React from 'react';
import Table from "./table";

export default function TableGauche(props) {
    return (
        <Table rows={ props.rows }>
            <h3 className={ 'corps-title-1' }>{ props.title }</h3>
        </Table>
    );
}