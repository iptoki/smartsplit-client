import React, {Component} from 'react'
import { Translation } from 'react-i18next'
import axios from 'axios'

import { toast } from 'react-toastify'

export default class ListePieces extends Component {

    constructor(props) {
        super(props)
        this.state={medias:[]}
    }

    componentWillMount() {

        axios.get('http://api.smartsplit.org:8080/v1/media')
        .then((res)=>{
            this.setState({medias:res.data})
        })
        .catch((error) => {
            toast.error(error)            
        })

    }

    render() {

        let tableauMedias = []
        if(this.state.medias.length > 0) {
          tableauMedias = this.state.medias.map((elem, _idx)=>{
            return (
                <div key={_idx} style={{marginTop: "20px"}}>
                    <div className="ui three column grid">
                        <div className="ui row">
                            <div className="ui thirteen wide column">
                                <div className="ui three column grid cliquable" onClick={()=>{window.location.href = `/oeuvre/sommaire/${elem.mediaId}`}} >
                                    <div className="ui row">
                                        <div className="ui one wide column">
                                            <i className="file image outline icon big grey"></i>
                                        </div>
                                        <div className="ui fifteen wide column">
                                            <div className="song-name">{`${elem.title}`}</div>
                                            <div className="small-400" style={{display: "inline-block"}}>&nbsp;&nbsp;Par&nbsp;</div><div className="small-500-color" style={{display: "inline-block"}}>{`${elem.artist}`}</div>
                                            <br/>
                                            <div className="small-400-color" style={{display: "inline-block"}}>Modifié il y a 2 jours &bull; Partagée avec</div>
                                        </div>
                                    </div>
                                </div>
                            </div>                            
                        </div>
                    </div>
                </div>
            )
        })}

        return (
            <Translation>
                {
                    t=>
                        <div>
                            <div className="heading2">{t('tableaudebord.navigation.0')}</div>
                            <br/>
                            <div className="medium-500">Mes ajouts</div>
                            <ul>{tableauMedias}</ul>                            
                        </div>
                }
            </Translation>
        )
    }
}