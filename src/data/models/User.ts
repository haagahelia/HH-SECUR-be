import { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Model, NotEmpty, PrimaryKey, Table, Unique, UpdatedAt } from "sequelize-typescript";


@Table({
    tableName: "user",
    modelName: "User",
})
export default class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
    @Column({
        primaryKey: true,
        type: DataType.BIGINT,
        autoIncrement: true,
    })
    declare id: CreationOptional<number>

    @AllowNull(false)
    @NotEmpty
    @Unique
    @Column({
        type: DataType.STRING
    })
    declare username: string;

    @AllowNull(false)
    @NotEmpty
    @Unique
    @Column({
        type: DataType.STRING
    })
    declare email: string;


    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.STRING
    })
    declare password_hash: string;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.STRING
    })
    declare role: string;

    @CreatedAt
    declare created_at: CreationOptional<Date>;

    @UpdatedAt
    declare updated_at: CreationOptional<Date>;
}