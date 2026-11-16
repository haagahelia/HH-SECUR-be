import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import { AllowNull, Column, DataType, HasMany, Model, NotEmpty, PrimaryKey, Table, Unique, } from "sequelize-typescript";
import Report from "./Report";


@Table({
    tableName: "report_status",
    modelName: "ReportStatus",
})

export default class ReportStatus extends Model<
    InferAttributes<ReportStatus>,
    InferCreationAttributes<ReportStatus>

> {
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
    })
    declare id: CreationOptional<number>

    @AllowNull(false)
    @NotEmpty
    @Unique({ name: "report_status_code_unique", msg: "Report status code must be unique" })
    @Column({
        type: DataType.STRING,
        field: "code",
    })
    declare code: string;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.STRING,
        field: "name_fi",
    })
    declare fi: string;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.STRING,
        field: "name_en",
    })
    declare en: string;

    @HasMany(() => Report)
    declare reports?: NonAttribute<Report>[];
}