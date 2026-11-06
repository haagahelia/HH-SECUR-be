import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import { AllowNull, BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Index, Model, NotEmpty, PrimaryKey, Table, Unique, } from "sequelize-typescript";
import Report from "./Report";
import Consortium from "./Consortium";
import ConsortiumOrganization from "./ConsortiumOrganization";
import Country from "./Country";


@Table({
    tableName: "organization",
    modelName: "Organization",
    indexes: [
        {
            name: "organization_name_fi_country_code_unique",
            unique: true,
            fields: ["name_fi", "country_code"]
        },
        {
            name: "organization_name_en_country_code_unique",
            unique: true,
            fields: ["name_en", "country_code"]
        }
    ]
})
export default class Organization extends Model<
    InferAttributes<Organization>,
    InferCreationAttributes<Organization>
> {
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
    })
    declare id: CreationOptional<number>

    @ForeignKey(() => Country)
    @AllowNull(true)
    @Column({
        type: DataType.BIGINT,
        field: "country_id",
    })
    declare countryId: number | null;

    @AllowNull(true)
    @NotEmpty
    @Unique({ name: "organization_code_unique", msg: "Organization code must be unique" })
    @Column({
        type: DataType.STRING,
        field: "code",
    })
    declare code: string | null;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.STRING,
        field: "name_fi"
    })
    declare fi: string;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.STRING,
        field: "name_en"
    })
    declare en: string;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.STRING
    })
    declare country_code: string;

    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN
    })
    declare added_manually: boolean;

    /*
    @HasMany(() => Report)
    declare reports?: NonAttribute<Report>[];
*/

    @BelongsTo(() => Country)
    declare country?: NonAttribute<Country>;

    @BelongsToMany(() => Consortium, () => ConsortiumOrganization)
    declare consortiums?: NonAttribute<Consortium[]>;

}
