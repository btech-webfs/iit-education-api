import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateSubjectDto {
    @IsNotEmpty()
    name: string;

    @IsOptional()
    icon?: string;

    @IsNotEmpty()
    desc: string;
}
