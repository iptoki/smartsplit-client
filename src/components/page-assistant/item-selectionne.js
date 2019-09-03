import React from 'react';
import xIcon from "../../assets/svg/icons/x.svg";
import '../../assets/scss/page-assistant/item-selectionne.scss';

export function ItemSelectionne(props) {

    function selectionAvatar(props) {
        return props.image ?
            (
                <div className="selection-avatar">
                    <img src={ props.image }
                         alt={ props.nom }
                    />
                </div>
            ) :
            (<></>);
    }

    return (
        <div className="selection-row"
             onClick={ (event) => props.onClick(event) }
        >
            <div className="left">
                { selectionAvatar(props) }

                <div className="selection-name">
                    { props.nom }
                </div>
            </div>

            <div className="right">
                <img className="x-icon"
                     src={ xIcon }
                     alt={ 'Enlever ' + props.nom }
                />
            </div>
        </div>
    );
}