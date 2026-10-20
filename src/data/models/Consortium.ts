
import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import { AllowNull, BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, NotEmpty, PrimaryKey, Table, Unique, } from "sequelize-typescript";
import Report from "./Report";
import ConsortiumType from "./ConsortiumType";
import Organization from "./Organization";
import ConsortiumOrganization from "./ConsortiumOrganization";


@Table({
    tableName: "consortium",
    modelName: "Consortium",
})

export default class Consortium extends Model<
    InferAttributes<Consortium>,
    InferCreationAttributes<Consortium>
> {
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
    })
    declare id: CreationOptional<number>

    @ForeignKey(() => ConsortiumType)
    @AllowNull(true)
    @Column({
        type: DataType.BIGINT,
        field: "consortium_type_id",
    })
    declare consortiumTypeId: number;

    @HasOne(() => Report)
    declare reports?: NonAttribute<Report>;

    @BelongsToMany(() => Organization, () => ConsortiumOrganization)
    declare organizations?: NonAttribute<Organization[]>;

    @BelongsTo(() => ConsortiumType)
    declare consortiumType?: NonAttribute<ConsortiumType>;

}
