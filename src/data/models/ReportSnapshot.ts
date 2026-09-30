import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, NotEmpty, Table, Unique, UpdatedAt, } from "sequelize-typescript";
import Report from "./Report";


@Table({
    tableName: "report_snapshot",
    modelName: "ReportSnapshot",
})

export default class ReportSnapshot extends Model<
    InferAttributes<ReportSnapshot>,
    InferCreationAttributes<ReportSnapshot>
> {
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
    })
    declare id: CreationOptional<number>

    @ForeignKey(() => Report)
    @AllowNull(false)
    @Column({
        type: DataType.BIGINT,
        field: "report_id",
    })
    declare reportId: number;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.STRING,
        field: "name",
    })
    declare name: string;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.STRING,
        field: "owner_username",
    })
    declare ownerUsername: string;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.STRING,
        field: "creator_username",
    })
    declare creatorUsername: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
        field: "organization_name",
    })
    declare organizationName: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
        field: "additional_information",
    })
    declare additionalInformation: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
        field: "organization_other",
    })
    declare organizationOther: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
        field: "collaboration_other",
    })
    declare collaborationOther: string;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.INTEGER,
        field: "collaboration",
        validate: {
            min: 0,
            max: 3
        }
    })
    declare collaboration: number;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.INTEGER,
        field: "country_overall",
        validate: {
            min: 0,
            max: 3
        }
    })
    declare countryOverall: number;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.INTEGER,
        field: "countryCorruption",
        validate: {
            min: 0,
            max: 3
        }
    })
    declare countryCorruption: number;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.INTEGER,
        field: "country_security",
        validate: {
            min: 0,
            max: 3
        }
    })
    declare countrySecurity: number;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.INTEGER,
        field: "country_academic_freedom",
        validate: {
            min: 0,
            max: 3
        }
    })
    declare countryAcademicFreedom: number;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.INTEGER,
        field: "country_political_stability",
        validate: {
            min: 0,
            max: 3
        }
    })
    declare countryPoliticalStability: number;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.INTEGER,
        field: "country_development",
        validate: {
            min: 0,
            max: 3
        }
    })
    declare countryDevelopment: number;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.INTEGER,
        field: "country_gdpr",
        validate: {
            min: 0,
            max: 3
        }
    })
    declare countryGdpr: number;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.INTEGER,
        field: "country_sanctions",
        validate: {
            min: 0,
            max: 3
        }
    })
    declare countrySanctions: number;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.INTEGER,
        field: "country_rule_of_law",
        validate: {
            min: 0,
            max: 3
        }
    })
    declare countryRuleOfLaw: number;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.INTEGER,
        field: "organization",
        validate: {
            min: 0,
            max: 3
        }
    })
    declare organization: number;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.INTEGER,
        field: "financial_overall",
        validate: {
            min: 0,
            max: 3
        }
    })
    declare financialOverall: number;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.INTEGER,
        field: "financial_exchange",
        validate: {
            min: 0,
            max: 3
        }
    })
    declare financialExchange: number;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.INTEGER,
        field: "financial_scope",
        validate: {
            min: 0,
            max: 3
        }
    })
    declare financialScope: number;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.INTEGER,
        field: "dual_use",
        validate: {
            min: 0,
            max: 3
        }
    })
    declare dualUse: number;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.INTEGER,
        field: "ethics",
        validate: {
            min: 0,
            max: 3
        }
    })
    declare ethics: number;

    @CreatedAt
    declare created_at: CreationOptional<Date>;

    @UpdatedAt
    declare updated_at: CreationOptional<Date>;

    @BelongsTo(() => Report)
    declare report?: NonAttribute<Report>

}

