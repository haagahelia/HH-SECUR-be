import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import { AllowNull, Column, DataType, HasMany, Model, NotEmpty, PrimaryKey, Table, Unique } from "sequelize-typescript";
import Report from "./Report";


@Table({
    tableName: "funding_source",
    modelName: "FundingSource",
})
export default class FundingSource extends Model<
    InferAttributes<FundingSource>,
    InferCreationAttributes<FundingSource>> {

    @PrimaryKey
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
    })
    declare id: CreationOptional<number>

    @AllowNull(false)
    @NotEmpty
    @Unique({name: "funding_source_code_unique", msg: "code for funding source must be unique"})
    @Column({
        type: DataType.STRING
    })
    declare code: string;

    @AllowNull(false)
    @NotEmpty
    @Unique({name: "funding_source_name_fi_unique", msg: "name for funding source must be unique"})
    @Column({
        type: DataType.STRING,
        field: "name_fi"
    })
    declare fi: string;

    @AllowNull(false)
    @NotEmpty
    @Unique({name: "funding_source_name_en_unique", msg: "name for funding source must be unique"})
    @Column({
        type: DataType.STRING,
        field: "name_en"
    })
    declare en: string;

    @HasMany(() => Report)
    declare reports?: NonAttribute<Report>[];
}
