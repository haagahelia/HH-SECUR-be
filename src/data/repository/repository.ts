import BaseRepository from "./BaseRepository.js";
import { AddUserRepository } from "./AddUserRepository.js";
import { AddOrganizationRepository } from "./AddOrganizationRepository.js";
import { AddHHRoleRepository } from "./AddHHRoleRepository.js";
import { AddCollaborationTypeRepository } from "./AddCollaborationTypeRepository.js";
import { AddCountryRepository } from "./AddCountryRepository.js";
import { AddConsortiumTypeRepository } from "./AddConsortiumTypeRepository.js";
import { AddOrganizationTypeRepository } from "./AddOrganizationTypeRepository.js";
import { AddDurationRepository } from "./AddDurationRepository.js";
import { AddCollaborationHistoryRepository } from "./AddCollaborationHistoryRepository.js";
import { AddEthicsAssessmentRepository } from "./AddEthicsAssessmentRepoitory.js";
import { AddLiabilityRepository } from "./addLiabilityRepository.js";
import { AddDualUseRepository } from "./AddDualUseRepository.js";
import { AddReportSnapshotRepository} from "./AddReportSnapshotRepository.js"
import { AddReportRepository } from "./AddReportRepository.js";
import { AddPersonalInformationRepository } from "./AddPersonalInformationRepository.js";
import { AddContractInfoRepository } from "./AddContractInfoRepository.js";
import { AddFundingRepository } from "./AddFundingRepository.js";
import { AddFundingSourceRepository } from "./AddFundingSourceRepository.js";

const CombinedRepository = AddReportSnapshotRepository
    (AddFundingSourceRepository
        (AddFundingRepository
            (AddReportRepository
            (AddCollaborationTypeRepository
                (AddCountryRepository
                    (AddHHRoleRepository
                        (AddConsortiumTypeRepository
                            (AddOrganizationTypeRepository
                                (AddDurationRepository
                                    (AddContractInfoRepository
                                        (AddCollaborationHistoryRepository
                                            (AddEthicsAssessmentRepository
                                                (AddLiabilityRepository
                                                    (AddOrganizationRepository
                                                        (AddDualUseRepository
                                                            (AddPersonalInformationRepository
                                                                (AddUserRepository
                                                                    (BaseRepository))))))))))))))))));const repository = new CombinedRepository();

//const repository = new BaseRepository();

export default repository;
