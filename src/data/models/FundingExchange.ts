import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import { AllowNull, Column, DataType, HasMany, Model, NotEmpty, PrimaryKey, Table, Unique } from "sequelize-typescript";
import Funding from "./Funding";


@Table({
    tableName: "funding_exchange",
    modelName: "FundingExchange",
})
export default class FundingExchange extends Model<
    InferAttributes<FundingExchange>,
    InferCreationAttributes<FundingExchange>> {

    @PrimaryKey
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
    })
    declare id: CreationOptional<number>

    @AllowNull(false)
    @NotEmpty
    @Unique({ name: "funding_code_unique", msg: "code for funding must be unique" })
    @Column({
        type: DataType.STRING
    })
    declare code: string;

    @AllowNull(false)
    @NotEmpty
    @Unique({ name: "funding_name_fi_unique", msg: "name for funding must be unique" })
    @Column({
        type: DataType.STRING,
        field: "name_fi"
    })
    declare fi: string;

    @AllowNull(false)
    @NotEmpty
    @Unique({ name: "funding_name_en_unique", msg: "name for funding must be unique" })
    @Column({
        type: DataType.STRING,
        field: "name_en"
    })
    declare en: string;

    @HasMany(() => Funding)
    declare fundings?: NonAttribute<Funding>[];
}