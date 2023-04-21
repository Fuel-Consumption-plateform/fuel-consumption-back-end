import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateDeviceDto } from "./create.dto";



export class UpdateDeviceDto extends PartialType(OmitType(CreateDeviceDto, [] as const )) {}