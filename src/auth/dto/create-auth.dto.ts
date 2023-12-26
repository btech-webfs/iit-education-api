import { IsNotEmpty } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty()
    key: string;

    @IsNotEmpty()
    duid: string;
}
