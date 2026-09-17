import BaseRepository from "./BaseRepository.js";
import { AddUserRepository } from "./AddUserRepository.js";
import { AddOrganizationRepository } from "./AddOrganizationRepository.js";

const CombinedRepository = AddOrganizationRepository(AddUserRepository(BaseRepository));
const repository = new CombinedRepository();

//const repository = new BaseRepository();

export default repository;