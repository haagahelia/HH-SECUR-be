import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import { AllowNull, BelongsTo, Column, DataType, ForeignKey, HasMany, Index, Model, NotEmpty, PrimaryKey, Table, Unique, } from "sequelize-typescript";
import Report from "./Report";
import CollaborationType from "./CollaborationType";
import Consortium from "./Consortium";
import Organization from "./Organization";


@Table({
    tableName: "consortium_organization",
    modelName: "ConsortiumOrganization",
})

export default class ConsortiumOrganization extends Model<
    InferAttributes<ConsortiumOrganization>,
    InferCreationAttributes<ConsortiumOrganization>
> {
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
    })
    declare id: CreationOptional<number>

    @ForeignKey(() => Consortium)
    @AllowNull(false)
    /*
    @Index({
        name: "report_collaboration_type_unique",
        unique: true,
    })
        */
    @Column({
        type: DataType.BIGINT,
        field: "consortium_id",
    })
    declare consortiumId: number;

    @ForeignKey(() => Organization)
    @AllowNull(false)
    /*
    @Index({
        name: "report_collaboration_type_unique",
        unique: true,
    })
        */
    @Column({
        type: DataType.BIGINT,
        field: "organization_id",
    })
    declare organizationId: number;

    @BelongsTo(() => Consortium)
    declare consortium?: NonAttribute<Consortium>;

    @BelongsTo(() => Organization)
    declare organization?: NonAttribute<Organization>;

}