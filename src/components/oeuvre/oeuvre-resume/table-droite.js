import React from 'react';
import Table from "./table";

export default function TableDroite(props) {
    return (
        <Table rows={ props.rows }>
            <h4 className={ 'corps-title-2' }>{ props.title }</h4>
        </Table>
    );
}
