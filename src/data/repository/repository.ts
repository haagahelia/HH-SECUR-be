import BaseRepository from "./BaseRepository.js";
import { AddUserRepository } from "./AddUserRepository.js";
import { AddHHRoleRepository } from "./AddHHRoleRepository.js";

const CombinedRepository = AddHHRoleRepository(AddUserRepository(BaseRepository));
const repository = new CombinedRepository();

//const repository = new BaseRepository();

export default repository;