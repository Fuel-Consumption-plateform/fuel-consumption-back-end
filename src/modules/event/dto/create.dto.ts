import { IsNotEmpty } from "class-validator";

export class CreateEventDto {
    @IsNotEmpty({ message: 'Vehicule is required' })
    vehicule_id?: string;

    @IsNotEmpty({ message: 'date_start is required' })
    date_start?: string;

    date_end?: string;

    @IsNotEmpty({ message: 'quantité is required' })
    quantite_start?: string;

    quantite_end?: string;

    postionnement?: {
      lat: number;
      long: number;
    };

    @IsNotEmpty({ message: 'type event is required' })
    type_event?: string;
    
  
  }
  