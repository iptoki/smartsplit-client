import React, { Component } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import Beignet from '../visualisation/partage/beignet'
import { withTranslation } from 'react-i18next'
import LogIn from '../auth/Login'
import { Modal } from 'semantic-ui-react'
import editIcon from '../../assets/svg/icons/edit.svg'
// eslint-disable-next-line
import {Identite, config, AyantsDroit, utils, journal} from '../../utils/application'
import "../../assets/scss/tableaudebord/tableaudebord.scss";
import { CopyrightSVG } from '../svg/SVG.js'

// eslint-disable-next-line
const NOM = "PartageSommaireEditeur"

class PartageSommaireEditeur extends Component {

    constructor(props) {
        super(props)
        this.state = {
            idx: props.idx,
            part: props.part,
            proposition: props.proposition,
            utilisateur: props.ayantDroit,
            jetonApi: props.jetonApi,
            modifierVote: false,
            titre: props.titre,
            choix: props.part.etat === 'ACCEPTE' ? 'accept' : (props.part.etat === 'REFUSE' ? 'reject' : 'active')
        }
        this.boutonAccepter = this.boutonAccepter.bind(this)
        this.boutonRefuser = this.boutonRefuser.bind(this)
        this.changerVote = this.changerVote.bind(this)
        this.estVoteFinal = this.estVoteFinal.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.part !== nextProps.part) {
            this.setState({ part: nextProps.part })
        }
        if (this.props.proposition !== nextProps.proposition) {
            this.setState({ proposition: nextProps.proposition })
        }
        if (this.props.avatars !== nextProps.avatars) {
            this.setState({ avatars: nextProps.avatars })
        }
        if (this.props.ayantDroit !== nextProps.ayantDroit) {
            this.setState({ ayantDroit: nextProps.ayantDroit })
        }
    }

    componentWillMount() {
        this.rafraichirDonnees(() => {
            if (!this.estVoteFinal() && (this.estVoteClos() || this.state.rafraichirAuto)) {
                this.setState({ rafraichir: true }, () => {
                    this.rafraichissementAutomatique()
                })
            }
        })

        // Récupère tous les ayant-droits        
        let _rHs = Object.assign({}, AyantsDroit.ayantsDroit, AyantsDroit.editeurs)

        this.setState({ ayantsDroit: _rHs }, () => {
            let donateur = _rHs[this.state.part.rightHolderId]
            let beneficiaire = _rHs[this.state.part.shareeId]
            this.setState({ donateur: donateur })
            this.setState({ beneficiaire: beneficiaire }, ()=>{
                // Créer une structure pour les données du beignet avec tous les collaborateurs du partage
                let _rH = {}
                let donnees = []
                let parts = this.state.proposition.rightsSplits.workCopyrightSplit
                // Paroles
                parts.lyrics.forEach((elem, idx) => {
                    if (!_rH[elem.rightHolder.rightHolderId]) {
                        _rH[elem.rightHolder.rightHolderId] = { nom: undefined, pourcent: 0 }
                    }
                    _rH[elem.rightHolder.rightHolderId].nom = elem.rightHolder.name
                    _rH[elem.rightHolder.rightHolderId].color = elem.rightHolder.color
                    _rH[elem.rightHolder.rightHolderId].pourcent = parseFloat(_rH[elem.rightHolder.rightHolderId].pourcent) + parseFloat(elem.splitPct)
                })
                // Musique
                parts.music.forEach((elem, idx) => {
                    if (!_rH[elem.rightHolder.rightHolderId]) {
                        _rH[elem.rightHolder.rightHolderId] = { nom: undefined, pourcent: 0 }
                    }
                    _rH[elem.rightHolder.rightHolderId].nom = elem.rightHolder.name
                    _rH[elem.rightHolder.rightHolderId].color = elem.rightHolder.color
                    _rH[elem.rightHolder.rightHolderId].pourcent = parseFloat(_rH[elem.rightHolder.rightHolderId].pourcent) + parseFloat(elem.splitPct)
                })
                // Calcul des données pour le beignet par ayant-droit
                Object.keys(_rH).forEach((elem) => {
                    if (elem === this.state.part.rightHolderId) {
                        // c'est l'utlisateur connecté, on lui assigne 100 % du partage avec l'éditeur
                        let _aD = {}
                        _aD.pourcent = 100
                        _aD.color = _rH[elem].color
                        _aD.nom = _rH[elem].nom
                        this.setState({ ayantDroit: _aD })
                        this.setState({ partPrincipale: _rH[elem].pourcent })
                        // on pousse l'utilisateur ET l'éditeur
                        donnees.push({ ayantDroit: this.state.donateur, color: _rH[elem].color, nom: _rH[elem].nom, pourcent: parseFloat(_rH[elem].pourcent * this.state.part.rightHolderPct / 100) })
                        donnees.push({
                            ayantDroit: this.state.beneficiaire,
                            color: "#bacada",
                            nom: this.state.beneficiaire.artistName ? this.state.beneficiaire.artistName : `${this.state.beneficiaire.firstName} ${this.state.beneficiaire.lastName}`,
                            pourcent: parseFloat(this.state.part.shareePct * _rH[elem].pourcent / 100)
                        })
                    } else {
                        // on pousse l'ayant-droit
                        donnees.push({ ayantDroit: this.state.ayantsDroit[elem], color: _rH[elem].color, nom: _rH[elem].nom, pourcent: parseFloat(_rH[elem].pourcent) })
                    }
                })
                this.setState({ donnees: donnees })
            })
        })
    }

    activerBoutonVote() {
        this.setState({
            transmission: true
        })
    }

    boutonAccepter() {
        const t = this.props.t
        return (            
            <div className="ui button medium vote" onClick={() => {
                this.voter(true)
            }}>{t('flot.split.vote.accepter')}</div>                
        )
    }

    refuser(raison) {
        this.setState({ raison: raison })
    }

    boutonRefuser() {
        const t = this.props.t
        return (            
            <div className="ui button vote refus" onClick={() => {
                this.voter(false)
                this.justifierRefus()
            }}>{t('flot.split.vote.refuser')}</div>                
        )
    }

    justifierRefus() {
        this.setState({ justifierRefus: true })
        this.setState({ choix: 'reject' })
    }

    changerVote() {
        this.setState({ modifierVote: false })
    }

    estVoteFinal() {
        // Détecte si le vote est terminé pour tous
        return this.state.part.etat === 'ACCEPTE' || this.state.part.etat === 'REFUSE'
    }

    voter(choix) {
        let _monChoix = choix ? 'accept' : 'reject'
        this.setState({ modifierVote: true })
        if (choix) {
            this.setState({ justifierRefus: false })
        }
        this.setState({ choix: _monChoix }, () => {
            this.activerBoutonVote()
        })
    }

    rafraichissementAutomatique() {
        setTimeout(() => {
            this.rafraichirDonnees(() => {
                if (!this.estVoteFinal() || this.state.rafraichir) {
                    this.rafraichissementAutomatique()
                    if (this.estVoteFinal()) {
                        // C'était le dernier rafraichissement (p.ex. cas où le dernier vote entre)
                        this.rafraichirDonnees()
                        this.setState({ rafraichir: false })
                    }
                }
            })
        }, 3000)
    }

    envoi() {
        let body = {
            userId: `${this.state.utilisateur.rightHolderId}`,
            choix: this.state.choix,
            jeton: this.state.jetonApi
        }
        axios.post(`${config.API_URL}splitShare/tiers/voter`, body)
            .then((res) => {
                utils.naviguerVersAccueil()
            })
            .catch((err) => {
                toast.error(err.message)
            })
    }

    modaleConnexion(ouvrir = true) {
        this.setState({ modaleConnexion: ouvrir })
    }

    transmettre() {
        if(Identite.usager) {
            if (Identite.usager.username === this.state.beneficiaire.rightHolderId) {
                this.envoi()
            } else {
                toast.error(this.props.t('flot.split.erreur.volIdentite'))
            }
        } else {
            this.modaleConnexion()
        }        
    }

    rafraichirDonnees() {
        if (this.state.rafraichir) {
            axios.get(`${config.API_URL}splitShare/${this.state.proposition.uuid}/${this.state.user.username}`)
            .then(res => {
                this.setState({ part: res.data })
            })
            .catch(err => {
                toast.error(err.message)
            })
        }
    }
    

    render() {
        const t = this.props.t

        if (this.state.beneficiaire && this.state.donateur) {
            let visualisation = (<Beignet type="workCopyrightSplit" uuid={`auteur--beignet__${this.state.idx}`} data={this.state.donnees} />)
            
            return (
                <>
            <div className="ui section divider sommaire" />

            <div className="ui grid">
	            <div className="ui row">
                    <div className="ui eight wide column">

                        <div className="ui grid">
                            <div className="ui row">

                            <div className="ui sixteen wide column">
                                <div className="wizard-title types" style={{margin: "0"}}>
                                    <div className="icon" style={{marginRight: "1.5rem"}}>
                                        <CopyrightSVG />
                                    </div>
                                    <div className="titre">
                                        {t(`flot.split.droits.auteur`)}
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div className="ui row">
                                <div className="ui two wide column">	
                                    <img alt="" className="ui spaced avatar image" src={`${config.IMAGE_SRV_URL}${this.state.beneficiaire.avatarImage}`} />
                                </div>

                                <div className="ui fourteen wide column">
                                    <div className="ui row">
                                        <div className="holder-name sommaire" style={{marginLeft: "-1rem"}}>
                                            {
                                            this.state.beneficiaire &&
                                            this.state.beneficiaire.artistName ?
                                            this.state.beneficiaire.artistName :
                                            `${this.state.beneficiaire.firstName} ${this.state.beneficiaire.lastName}`
                                            }
                                        <div className="vote">
                                            {parseFloat(this.state.part.shareePct).toFixed(2) + "%"}
                                        </div>
                                        </div>
                                    </div>

                                    <div className="ui row">
                                        <div className="role" style={{marginLeft: "-1rem"}}>
                                            {t('flot.split.documente-ton-oeuvre.editeur.editeur')}
                                        </div>
                                        <div className="statut">
                                            <div className={(this.state.choix === 'accept') ? "approuve" : (this.state.choix === "reject" ? "desaprouve" : "attente") }>
                                                {t(`flot.split.vote.${this.state.choix}`)}
                                            </div>
                                        </div>
                                    </div>   

                                    <div className="ui row">
                                    {
                    !this.estVoteFinal() &&
                    this.state.ayantDroit &&
                    this.state.part.shareeId === this.state.utilisateur.rightHolderId &&
                    (
                        <>
                            {!this.state.modifierVote && this.boutonRefuser()}
                            {!this.state.modifierVote && this.boutonAccepter()}
                            {
                                this.state.modifierVote &&
                                (
                                    <div>
                                        <img
                                            alt="edit"
                                            className="edit"
                                            src={editIcon}
                                            onClick={() => { this.changerVote() }} />
                                        {
                                            this.state.justifierRefus && (
                                                <div>
                                                    <textarea
                                                        cols={30}
                                                        rows={2}
                                                        placeholder={t("flot.split.sommaire.pourquoi")}
                                                        onChange={(e) => {
                                                            this.refuser(e.target.value)
                                                        }}>
                                                    </textarea>
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                            }
                        </>
                    )}
                    {
                        this.state.monVote &&
                        this.state.part.shareeId === this.state.utilisateur.rightHolderId && this.state.monVote.raison
                    }
                                    </div>                       
                                </div>

                            </div>

                            <div className="ui row">

                            <div className="ui two wide column">
                                <img alt="" className="ui spaced avatar image" src={`${config.IMAGE_SRV_URL}${this.state.donateur.avatarImage}`} />
                            </div>

                            <div className="ui fourteen wide column">
                                <div className="ui row">
                                    <div className="holder-name sommaire" style={{marginLeft: "-1rem"}}>
                                        {
                                        this.state.donateur &&
                                        this.state.donateur.artistName ?
                                        this.state.donateur.artistName :
                                        `${this.state.donateur.firstName} ${this.state.donateur.lastName}`
                                        }
                                    <div className="vote">
                                        {parseFloat(this.state.part.rightHolderPct).toFixed(2) + "%"} 
                                    </div>
                                    </div> 
                                </div>

                        <div className="ui row">

                            <div className="role" style={{marginLeft: "-1rem"}}>
                                {t('flot.split.documente-ton-oeuvre.editeur.donateur')}
                            </div>  
                            <div className= "statut">
                                <div className={(this.state.choix === 'accept') ? "approuve" : (this.state.choix === "reject" ? "desaprouve" : "attente") }>
                                    {t(`flot.split.vote.${this.state.choix}`)}</div>
                                </div>
                            </div>

                        </div>
                        
                    </div>

                        </div>
                    </div>
                    <div className="ui eight wide column">
                        
                        <div className="ui row">
                            <div className="ui sixteen wide column">
                                {visualisation}
                            </div>
                        </div>
                    </div>
                </div>
               

                </div>

                  
                
                    
                    {
                        this.state.part.etat === "VOTATION" &&
                        this.state.utilisateur.rightHolderId === this.state.part.shareeId &&
                        (
                            <button className="ui medium button" disabled={!this.state.transmission} onClick={() => {
                                this.transmettre()
                            }}> {t('flot.split.documente-ton-oeuvre.bouton.voter')}
                            </button>
                        )
                    }
                    <Modal
                        open={this.state.modaleConnexion}
                        closeOnEscape={false}
                        closeOnDimmerClick={false}
                        onClose={this.props.close}
                        size="small" >
                        <br /><br /><br />
                        <LogIn
                            vote={true}
                            fn={() => { if(Identite.usager) { this.envoi() } }} />
                    </Modal>
                </>
            )
        } else {
            return (<div></div>)
        }
    }
}

export default withTranslation()(PartageSommaireEditeur)