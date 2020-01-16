/**
 * Saisie du collaborateur principal de l'oeuvre
 */

import React, { Component } from "react";
import { Translation } from "react-i18next";
import { Progress } from "semantic-ui-react";

import axios from 'axios'
import { toast } from 'react-toastify'

import MenuProfil from "../navigation/menu-profil";

import placeholder from '../../assets/images/placeholder.png';

class EntetePartage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      media: this.props.media,
      user: this.props.user
    }
    this.soumettre = this.soumettre.bind(this)
  }

  soumettre(t, values, etat, cb) {

    if (this.state.user) {
      let _association = {} // Associera le nom de l'ayant-droit avec son identitifiant unique

      // 1. Récupérer la liste des ayant-droits
      axios.get(`http://dev.api.smartsplit.org:8080/v1/rightHolders`)
        .then(res => {
          res.data.forEach(elem => {
            //let nom = `${elem.firstName || ""} ${elem.lastName || ""} ${elem.artistName ? `(${elem.artistName})` : ""}`
            _association[elem.rightHolderId] = elem
          })
          // 2. Générer la structure à envoyer à Dynamo

          let droitEnregistrement = [];
          let droitInterpretePrincipal = [];
          let droitInterpreteAccompagnement = [];
          let droitAuteurMusique = [];
          let droitAuteurParoles = [];

          values.droitAuteur.forEach(elem => {

            let _rH = _association[elem.ayantDroit.rightHolderId]
            let uuid = _rH.rightHolderId

            if (elem.arrangeur || elem.compositeur) {
              let roles = {}
              if (elem.compositeur) {
                roles["45745c60-7b1a-11e8-9c9c-2d42b21b1a31"] = "composer"
              }
              if (elem.arrangeur) {
                roles["45745c60-7b1a-11e8-9c9c-2d42b21b1a32"] = "remixer"
              }
              droitAuteurMusique.push({
                "rightHolder": {
                  "name": elem.nom,
                  "rightHolderId": uuid,
                  "color": elem.color
                },
                "voteStatus": "active",
                "contributorRole": roles,
                "splitPct": `${elem.pourcentMusique}`
              }
              )
            }

            if (elem.auteur) {
              let roles = { "45745c60-7b1a-11e8-9c9c-2d42b21b1a33": "songwriter" }
              droitAuteurParoles.push({
                "rightHolder": {
                  "name": elem.nom,
                  "rightHolderId": uuid,
                  "color": elem.color
                },
                "voteStatus": "active",
                "contributorRole": roles,
                "splitPct": `${elem.pourcentParoles}`
              }
              )
            }
          })

          values.droitInterpretation.forEach(elem => {

            let _rH = _association[elem.ayantDroit.rightHolderId]
            let uuid = _rH.rightHolderId

            if (elem.principal) {
              let roles = { "45745c60-7b1a-11e8-9c9c-2d42b21b1a38": "principal" }
              if (elem.chanteur) {
                roles["45745c60-7b1a-11e8-9c9c-2d42b21b1a35"] = "singer"
              }
              if (elem.musicien) {
                roles["45745c60-7b1a-11e8-9c9c-2d42b21b1a36"] = "musician"
              }
              droitInterpretePrincipal.push({
                "rightHolder": {
                  "name": elem.nom,
                  "rightHolderId": uuid,
                  "color": elem.color
                },
                "voteStatus": "active",
                "contributorRole": roles,
                "splitPct": `${elem.pourcent}`
              })
            } else {
              let roles = { "45745c60-7b1a-11e8-9c9c-2d42b21b1a37": "accompaniment" }
              if (elem.chanteur) {
                roles["45745c60-7b1a-11e8-9c9c-2d42b21b1a35"] = "singer"
              }
              if (elem.musicien) {
                roles["45745c60-7b1a-11e8-9c9c-2d42b21b1a36"] = "musician"
              }
              droitInterpreteAccompagnement.push({
                "rightHolder": {
                  "name": elem.nom,
                  "rightHolderId": uuid,
                  "color": elem.color
                },
                "voteStatus": "active",
                "contributorRole": roles,
                "splitPct": `${elem.pourcent}`
              })
            }

          })

          values.droitEnregistrement.forEach(elem => {
            let _rH = _association[elem.ayantDroit.rightHolderId]
            let uuid = _rH.rightHolderId
            let roles = {}
            if (elem.producteur) {
              roles["45745c60-7b1a-11e8-9c9c-2d42b21b1a40"] = "producer"
            }
            if (elem.realisateur) {
              roles["45745c60-7b1a-11e8-9c9c-2d42b21b1a41"] = "director"
            }
            if (elem.studio) {
              //roles["45745c60-7b1a-11e8-9c9c-2d42b21b1a42"] = "studio"
              roles["45745c60-7b1a-11e8-9c9c-2d42b21b1a42"] = "studio"
            }
            if (elem.graphiste) {
              roles["45745c60-7b1a-11e8-9c9c-2d42b21b1a43"] = "graphist"
            }
            droitEnregistrement.push({
              "rightHolder": {
                "name": elem.nom,
                "rightHolderId": uuid,
                "color": elem.color
              },
              "voteStatus": "active",
              "contributorRole": roles,
              "splitPct": `${elem.pourcent}`
            })
          })

          if (values.droitAuteur.length + values.droitInterpretation.length + values.droitEnregistrement.length === 0) {
            toast.warn(t('info.partage.vide'))
          } else {
            let body = {
              uuid: "",
              mediaId: parseInt(`${this.state.mediaId}`),              
              initiatorUuid: this.state.user.username,
              initiatorName: `${this.state.user.attributes.given_name} ${this.state.user.attributes.family_name}`,
              rightsSplits: {
                "workCopyrightSplit": {
                  "lyrics": droitAuteurParoles,
                  "music": droitAuteurMusique
                },
                "performanceNeighboringRightSplit": {
                  "principal": droitInterpretePrincipal,
                  "accompaniment": droitInterpreteAccompagnement
                },
                "masterNeighboringRightSplit": {
                  "split": droitEnregistrement
                }
              },
              "comments": [],
              "etat": etat
            }
            body.comments.push({ rightHolderId: this.state.user.username, comment: "Initiateur du split" })

            if (values.uuid && values.uuid !== "") {
              // Reprise d'une proposition existante
              // 3a. Soumettre la nouvelle proposition en PUT
              body.uuid = values.uuid
              axios.put(`http://dev.api.smartsplit.org:8080/v1/proposal/${body.uuid}`, body)
                .then(res => {
                  //toast.success(`${res.data}`)
                  // 4. Exécuter une fonction passée en paramètre ou rediriger vers la page sommaire de la proposition
                  if (typeof cb === "function") {
                    cb()
                  } else {
                    this.modaleFin()
                  }
                })
                .catch(err => {
                  console.log(err)
                })
            } else {
              // 3b. Soumettre la nouvelle proposition en POST
              axios.post('http://dev.api.smartsplit.org:8080/v1/proposal', body)
                .then(res => {
                  // toast.success(`${res.data}`)
                  // 4. Exécuter une fonction passée en paramètre ou rediriger vers la page sommaire de la proposition
                  if (typeof cb === "function") {
                    cb()
                  } else {
                    this.modaleFin()
                  }
                })
                .catch(err => {
                  console.log(err)
                })
            }
          }

        })
        .catch(err => {
          console.log(err)
          if (typeof cb === "function") {
            setTimeout(() => {
              cb()
            }, 1000)
          }
        })
    }
  }

  getProgressPercent = () => {
    switch (this.props.currentPage) {
      case 0:
        return 20
      case 1:
        return 50
      case 2:
        return 85
      default:
        return 100
    }
  }

  render() {

    let imageSrc = placeholder
    if(this.state.media) {
        let elem = this.state.media        
        if(elem.files && elem.files.cover && elem.files.cover.files && elem.files.cover.files.length > 0) {
            elem.files.cover.files.forEach(e=>{
                if(e.access === 'public') {
                    imageSrc = `https://smartsplit-artist-storage.s3.us-east-2.amazonaws.com/${elem.mediaId}/cover/${e.file}`
                }
            })
        }
    }

    return (
      <Translation>
        {t => (
          <React.Fragment>
            <div
              className="fixed-top"
              style={{
                background: "#ffff",
                height: "4.4em",
                left: "0px"
              }}
            >
              <div className="ui sixteen column grid">
                <div className="ui row" style={{ display: "inline-flex", marginLeft: "20px", marginTop: "10px", marginBottom: "10px" }}>
                  <div className="ui one wide column">
                    <img className="cliquable" onClick={()=>this.props.enregistrerEtAllerAuSommaire(t, this.props.values, this.state.media.mediaId)} alt="Vignette" src={imageSrc} style={{width: "40px", height: "40px"}} />
                  </div>
                  <div className="ui eight wide column">                    
                    {this.state.media && (
                      <span
                        style={{ marginLeft: "15px", lineHeight: "40px" }}
                        className="medium-400 titre"
                      >
                        {this.state.media.title}
                      </span>
                    )}
                    <div className="heading4" style={{ display: "inline", marginLeft: "50px" }}>
                      {t("flot.split.documente-ton-oeuvre.etape.partage-titre")}
                    </div>
                  </div>
                  <div className="ui seven wide column">
                    <div
                      className="ui button negative"
                      style={{
                        top: 0,
                        position: "relative",
                        float: "right",
                        marginRight: "20px"
                      }}
                      onClick={() => this.props.enregistrerEtAllerAuSommaire(t, this.props.values, this.state.media.mediaId)}
                    >
                      {t(
                        "flot.split.documente-ton-oeuvre.etape.enregistrerEtQuitter"
                      )}
                    </div>
                  </div>                  
                  <span className="menu-droite" >                                                                            
                    <div
                      className="menuWrapper"
                      style={{
                        position: "absolute",
                        right: "220px"
                      }}
                    >                      
                    </div>
                  </span>
                </div>
              </div>              
              <Progress percent={this.getProgressPercent()} size="tiny" indicating />
            </div>
            <div className="ui six wide column">
              <span
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  right: "200px"
                }}
                className="entete--partage"
              ></span>
            </div>
          </React.Fragment>
        )}
      </Translation>
    );
  }
}

export default EntetePartage;
