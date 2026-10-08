import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import { AllowNull, BelongsTo, BelongsToMany, Column, CreatedAt, DataType, ForeignKey, HasMany, Model, NotEmpty, Table, Unique, UpdatedAt, } from "sequelize-typescript";
import ReportSnapshot from "./ReportSnapshot";
import CollaborationHistory from "./CollaborationHistory";
import CollaborationType from "./CollaborationType";
import ReportCollaborationType from "./ReportCollaborationType";
import ConsortiumType from "./ConsortiumType";
import ContractInfo from "./ContractInfo";
import Country from "./Country";
import DualUse from "./DualUse";
import Duration from "./Duration";
import EthicsAssessment from "./EthicsAssessment";
import HHRole from "./HHRole";
import Liability from "./Liability";
import Organization from "./Organization";
import OrganizationType from "./OrganizationType";
import PersonalInformation from "./PersonalInformation";
import User from "./User";
import Funding from "./Funding";
import FundingSource from "./FundingSource";


@Table({
    tableName: "report",
    modelName: "Report",
})

export default class Report extends Model<
    InferAttributes<Report>,
    InferCreationAttributes<Report>
> {
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
    })
    declare id: CreationOptional<number>

    @AllowNull(false)
    @NotEmpty
    @Unique({ name: "report_name_unique", msg: "report name has to be unique" })
    @Column({
        type: DataType.STRING,
        field: "name",
    })
    declare name: string;

    @ForeignKey(() => CollaborationHistory)
    @AllowNull(true)
    @Column({
        type: DataType.BIGINT,
        field: "collaboration_history_id",
    })
    declare collaborationHistoryId: number;

    @ForeignKey(() => ConsortiumType)
    @AllowNull(true)
    @Column({
        type: DataType.BIGINT,
        field: "consortium_type_id",
    })
    declare consortiumTypeId: number;

    @ForeignKey(() => ContractInfo)
    @AllowNull(true)
    @Column({
        type: DataType.BIGINT,
        field: "contract_info_id",
    })
    declare contractInfoId: number;

    @ForeignKey(() => Country)
    @AllowNull(true)
    @Column({
        type: DataType.BIGINT,
        field: "country_id",
    })
    declare countryId: number;

    @ForeignKey(() => DualUse)
    @AllowNull(true)
    @Column({
        type: DataType.BIGINT,
        field: "dual_use_id",
    })
    declare dualUseId: number;

    @ForeignKey(() => Duration)
    @AllowNull(true)
    @Column({
        type: DataType.BIGINT,
        field: "duration_id",
    })
    declare durationId: number;

    @ForeignKey(() => EthicsAssessment)
    @AllowNull(true)
    @Column({
        type: DataType.BIGINT,
        field: "ethics_assessment_id",
    })
    declare ethicsAssessmentId: number;

    @ForeignKey(() => HHRole)
    @AllowNull(true)
    @Column({
        type: DataType.BIGINT,
        field: "hhrole_id",
    })
    declare hhroleId: number;

    @ForeignKey(() => Liability)
    @AllowNull(true)
    @Column({
        type: DataType.BIGINT,
        field: "liability_id",
    })
    declare liabilityId: number;

    @ForeignKey(() => Funding)
    @AllowNull(true)
    @Column({
        type: DataType.BIGINT,
        field: "funding_id",
    })
    declare fundingId: number;

    @ForeignKey(() => FundingSource)
    @AllowNull(true)
    @Column({
        type: DataType.BIGINT,
        field: "funding_source_id",
    })
    declare fundingSourceId: number | null;

    @ForeignKey(() => Organization)
    @AllowNull(true)
    @Column({
        type: DataType.BIGINT,
        field: "organization_id",
    })
    declare organizationId: number;

    @ForeignKey(() => OrganizationType)
    @AllowNull(true)
    @Column({
        type: DataType.BIGINT,
        field: "organization_type_id",
    })
    declare organizationTypeId: number;

    @ForeignKey(() => PersonalInformation)
    @AllowNull(true)
    @Column({
        type: DataType.BIGINT,
        field: "personal_information_id",
    })
    declare personalInformationId: number;

    @ForeignKey(() => User)
    @AllowNull(true)
    @Column({
        type: DataType.BIGINT,
        field: "user_id",
    })
    declare userId: number;

    @CreatedAt
    declare created_at: CreationOptional<Date>;

    @UpdatedAt
    declare updated_at: CreationOptional<Date>;

    @HasMany(() => ReportSnapshot)
    declare reportSnapshots?: NonAttribute<ReportSnapshot>[];

    @BelongsTo(() => CollaborationHistory)
    declare collaborationHistory?: NonAttribute<CollaborationHistory>;

    @BelongsTo(() => ConsortiumType)
    declare consortiumType?: NonAttribute<ConsortiumType>;

    @BelongsTo(() => ContractInfo)
    declare contractInfo?: NonAttribute<ContractInfo>;

    @BelongsTo(() => Country)
    declare country?: NonAttribute<Country>;

    @BelongsTo(() => DualUse)
    declare dualUse?: NonAttribute<DualUse>;

    @BelongsTo(() => Duration)
    declare duration?: NonAttribute<Duration>;

    @BelongsTo(() => EthicsAssessment)
    declare ethicsAssessment?: NonAttribute<EthicsAssessment>;

    @BelongsTo(() => HHRole)
    declare hhrole?: NonAttribute<HHRole>;

    @BelongsTo(() => Liability)
    declare liability?: NonAttribute<Liability>;

    @BelongsTo(() => Funding)
    declare funding?: NonAttribute<Funding>;

    @BelongsTo(() => FundingSource)
    declare fundingSource?: NonAttribute<FundingSource>;

    @BelongsTo(() => Organization)
    declare organization?: NonAttribute<OrganizationType>;

    @BelongsTo(() => OrganizationType)
    declare organizationType?: NonAttribute<OrganizationType>;

    @BelongsTo(() => PersonalInformation)
    declare personalInformation?: NonAttribute<PersonalInformation>;

    @BelongsTo(() => User)
    declare user?: NonAttribute<User>;

    @BelongsToMany(() => CollaborationType, () => ReportCollaborationType)
    declare collaborationTypes?: NonAttribute<CollaborationType[]>;


}