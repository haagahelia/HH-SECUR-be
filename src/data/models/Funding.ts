import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, NotEmpty, PrimaryKey, Table, Unique, UpdatedAt } from "sequelize-typescript";
import FundingOption from "./FundingOption";
import FundingSource from "./FundingSource";


@Table({
    tableName: "funding",
    modelName: "Funding",
})
export default class Funding extends Model<
    InferAttributes<Funding>,
    InferCreationAttributes<Funding>> {

    @PrimaryKey
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
    })
    declare id: CreationOptional<number>

    @ForeignKey(() => FundingOption)
    @AllowNull(false)
    @Column({
        type: DataType.BIGINT,
        field: "funding_option_id",
    })
    declare fundingOptionId: number;

    @ForeignKey(() => FundingSource)
    @AllowNull(true)
    @Column({
        type: DataType.BIGINT,
        field: "funding_source_id",
    })
    declare fundingSourceId: number | null;

    @BelongsTo(() => FundingOption)
    declare fundingOption?: NonAttribute<FundingOption>;

    @BelongsTo(() => FundingSource)
    declare fundingSource?: NonAttribute<FundingSource>;

    @CreatedAt
    declare created_at: CreationOptional<Date>;

    @UpdatedAt
    declare updated_at: CreationOptional<Date>;

    /*
    @AllowNull(false)
    @NotEmpty
    @Unique({name: "funding_code_unique", msg: "code for funding must be unique"})
    @Column({
        type: DataType.STRING
    })
    declare code: string;

    @AllowNull(false)
    @NotEmpty
    @Unique({name: "funding_name_fi_unique", msg: "name for funding must be unique"})
    @Column({
        type: DataType.STRING,
        field: "name_fi"
    })
    declare fi: string;

    @AllowNull(false)
    @NotEmpty
    @Unique({name: "funding_name_en_unique", msg: "name for funding must be unique"})
    @Column({
        type: DataType.STRING,
        field: "name_en"
    })
    declare en: string;
    */
}

