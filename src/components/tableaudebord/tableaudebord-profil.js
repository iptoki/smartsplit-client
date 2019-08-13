import React, { Component } from 'react'
import { Translation } from 'react-i18next';

export default class MonProfil extends Component {
    render() {
        return (
            <Translation>
                {
                    t =>
                        <div>
                            <h1>{ t('tableaudebord.navigation.1') }</h1>
                        </div>
                }
            </Translation>
        )
    }
}