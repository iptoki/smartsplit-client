import React, { useState } from "react"
import { useHistory } from "react-router"
import { useTranslation } from "react-i18next"
import { useCurrentWorkpiece } from "../context"
import Layout from "../layout"
import Button from "../../../widgets/button"
import { Column, Row, Flex, Hairline, Spacer } from "../../../layout"
import { Text, Heading, Paragraph, Link } from "../../../text"
import { Colors, Metrics } from "../../../theme"
import {
	RadioGroupButton,
	RadioButton,
	RadioGroup,
	CheckBox,
	CheckBoxGroup,
	Dropdown,
	FileField,
} from "../../../forms"
import AddCollaboratorDropdown from "../../../smartsplit/components/AddCollaboratorDropdown"
import FilesIcon from "../../../svg/files"
import Unlock from "../../../svg/unlock"
import LockIcon from "../../../svg/lock"
import Download from "../../../svg/download"
import UnlockDownload from "../../../svg/unlock-download"
import AlbumArt from "../../../smartsplit/media/albumArt"
import { FormStyles } from "./FormStyles"
import DocCreationModel from "../../../mobX/models/workpieces/documentation/DocCreationModel"
import { useDocsModel } from "../../../mobX/hooks"
import DocFilesModel from "../../../mobX/models/workpieces/documentation/DocFilesModel"

export function FilesForm(props) {
	const { t } = useTranslation()
	const workpiece = useCurrentWorkpiece()
	const model: DocFilesModel = useDocsModel(workpiece.id, "files")
	//	console.log(model.toJS())
	const workpieceId = workpiece.id
	return (
		<Row>
			<Column of="group" flex={5}>
				<Text action bold style={FormStyles.category}>
					<FilesIcon style={FormStyles.logo} />
					{t("document:files.category")}
					<Row padding="tiny" />
				</Text>
				<Heading level={1}>{t("document:files.title")}</Heading>
				<Paragraph>{t("document:files.paragraph")}</Paragraph>

				<Spacer of="component" />

				<Heading level={3}>{t("document:files.visual.title")}</Heading>
				<Column of="inside">
					<Paragraph>{t("document:files.visual.paragraph")}</Paragraph>
					<Link>{t("general:more")}</Link>
				</Column>
				<Column of="component">
					<Row of="component">
						<Column>
							<FileField
								name="file_upload"
								label={t("document:files.visual.format")}
								undertext={t("document:files.visual.undertext")}
								style={{ flex: 4 }}
								onFileChange={(file) => {
									//	console.log(file)
									model.upload(workpiece.id, file, "private", "art")
								}}
							/>
						</Column>
						<Column>
							<AlbumArt
								style={[FormStyles.albumArt, FormStyles.cover]}
								Image={model.art.array[0]?.uri}
							/>
						</Column>
					</Row>
					{/* ToDo: No green border when clicking on access and download fields */}
					<Dropdown
						label={t("document:access")}
						/* 	placeholder={
								<>
									<UnlockDownload />
									<Text>
										{t("document:files.dropdownDownloads.invitation")}
									</Text>
									<Flex />
								</>
							} */
						noFocusToggle
						tooltip=""
					>
						<Column of="tiny" layer="overground_moderate">
							<Row of="component">
								<Column padding="tiny">
									<Download />
								</Column>
								<Column padding="tiny">
									<Row>
										<Text>{t("document:files.dropdownDownloads.public")}</Text>
									</Row>
									<Row>
										<Text secondary small>
											{t("document:files.dropdownDownloads.publicUndertext")}
										</Text>
									</Row>
								</Column>
							</Row>
							<Row of="component">
								<Column padding="tiny">
									<UnlockDownload />
								</Column>
								<Column padding="tiny">
									<Row>
										<Text>
											{t("document:files.dropdownDownloads.invitation")}
										</Text>
									</Row>
									<Row>
										<Text secondary small>
											{t(
												"document:files.dropdownDownloads.invitationUndertext"
											)}
										</Text>
									</Row>
								</Column>
							</Row>
							<Row of="component">
								<Column padding="tiny">
									<LockIcon />
								</Column>
								<Column padding="tiny">
									<Row>
										<Text>{t("document:files.dropdownDownloads.private")}</Text>
									</Row>
									<Row>
										<Text secondary small>
											{t("document:files.dropdownDownloads.privateUndertext")}
										</Text>
									</Row>
								</Column>
							</Row>
						</Column>
					</Dropdown>
				</Column>

				<Spacer of="component" />
				<Hairline />
				<Spacer of="component" />

				<Column of="component">
					<Heading level={3}>{t("document:files.audio.title")}</Heading>
					<Paragraph>{t("document:files.audio.paragraph")}</Paragraph>
					<RadioGroup label={t("document:files.audio.subTitle")}>
						<RadioGroupButton
							value={workpiece.id}
							label="LoveYouBabyMasterv1.wav"
						/>
						<RadioGroupButton
							value={workpiece.id}
							label="LoveYouBabyMasterv1.wav"
						/>
						<RadioGroupButton
							value="add"
							label={<Text bold>{t("document:files.audio.addFile")}</Text>}
							style={FormStyles.radio_font}
						/>
					</RadioGroup>
					<Row of="component">
						<Column flex={0.1} />
						<FileField
							name="file_upload"
							undertext={t("document:files.audio.undertext")}
							style={{ flex: 4 }}
						/>
					</Row>
					<Dropdown
						label={t("document:access")}
						/* 	placeholder={
								<>
									<UnlockDownload />
									<Text>
										{t("document:files.dropdownDownloads.invitation")}
									</Text>
									<Flex />
								</>
							} */
						noFocusToggle
						tooltip=""
					>
						<Column of="tiny" layer="overground_moderate">
							<Row of="component">
								<Column padding="tiny">
									<Download />
								</Column>
								<Column padding="tiny">
									<Row>
										<Text>{t("document:files.dropdownAccess.public")}</Text>
									</Row>
									<Row>
										<Text secondary small>
											{t("document:files.dropdownAccess.publicUndertext")}
										</Text>
									</Row>
								</Column>
							</Row>
							<Row of="component">
								<Column padding="tiny">
									<UnlockDownload />
								</Column>
								<Column padding="tiny">
									<Row>
										<Text>{t("document:files.dropdownAccess.invitation")}</Text>
									</Row>
									<Row>
										<Text secondary small>
											{t("document:files.dropdownAccess.invitationUndertext")}
										</Text>
									</Row>
								</Column>
							</Row>
							<Row of="component">
								<Column padding="tiny">
									<LockIcon />
								</Column>
								<Column padding="tiny">
									<Row>
										<Text>{t("document:files.dropdownAccess.private")}</Text>
									</Row>
									<Row>
										{/* ToDo: Ce texte dépasse du dropdown */}
										<Text secondary small>
											{t("document:files.dropdownAccess.privateUndertext")}
										</Text>
									</Row>
								</Column>
							</Row>
						</Column>
					</Dropdown>
				</Column>

				<Spacer of="component" />
				<Hairline />
				<Spacer of="component" />

				<Heading level={3}>{t("document:files.other.title")}</Heading>
				<Paragraph>{t("document:files.other.paragraph")}</Paragraph>
				<Row of="component">
					<FileField
						name="file_upload"
						label={t("document:files.other.formatTablature")}
						undertext={t("document:files.other.undertext")}
						style={{ flex: 4 }}
						tooltip=""
					/>
					<Dropdown
						style={{ padding: 0 }}
						label={t("document:access")}
						/* 	placeholder={
								<>
									<UnlockDownload />
									<Flex />
								</>
							} */
						noFocusToggle
						tooltip=""
					>
						<Column
							of="component"
							layer="overground_moderate"
							padding="component"
						>
							<Row of="component">
								<Download />
							</Row>
							<Row of="component">
								<UnlockDownload />
							</Row>
							<Row of="component">
								<LockIcon />
							</Row>
						</Column>
					</Dropdown>
				</Row>
				<Row of="component">
					<FileField
						name="file_upload"
						label={t("document:files.other.formatMidi")}
						undertext={t("document:files.other.undertext")}
						style={{ flex: 4 }}
						tooltip=""
					/>
					<Dropdown
						label={t("document:access")}
						/* 	placeholder={
								<>
									<UnlockDownload />
									<Flex />
								</>
							} */
						noFocusToggle
						tooltip=""
					>
						<Column
							of="component"
							layer="overground_moderate"
							padding="component"
						>
							<Row of="component">
								<Download />
							</Row>
							<Row of="component">
								<UnlockDownload />
							</Row>
							<Row of="component">
								<LockIcon />
							</Row>
						</Column>
					</Dropdown>
				</Row>
			</Column>

			<Flex />

			<Column of="group" flex={4}>
				<Column of="component" padding="component" layer="underground">
					<Column of="inside">
						<Text small bold tertiary>
							{t("document:help")}
						</Text>
						<Hairline />
					</Column>
					<Heading level={4}>{t("document:why")}</Heading>
					<Text secondary>
						Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
						dolor sit amet.
					</Text>
				</Column>
			</Column>
		</Row>
	)
}
