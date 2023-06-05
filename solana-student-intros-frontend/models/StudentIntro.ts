import * as borsch from '@project-serum/borsh'

export class StudentIntro {
    name: string;
    message: string;
    // static serialize: any;

    constructor(name: string, message: string) {
        this.name = name;
        this.message = message;
    }
    borschInstructionSchema = borsch.struct([
        borsch.u8('variant'),
        borsch.str('name'),
        borsch.str('Description'),
    ])

    serialize() : Buffer {
        const buffer = Buffer.alloc(1000)
        this.borschInstructionSchema.encode ({...this, variant : 0},buffer)
        return buffer.slice(0,this.borschInstructionSchema.getSpan(buffer))

    }


    static borshAccountSchema = borsch.struct([
        borsch.u8('variant'),
        borsch.str('name'),
        borsch.str('Description'),
      ]);
    

    static deserialize(buffer?: Buffer): StudentIntro | null {
        if (!buffer) {
          return null;
        }
    
        try {
          const {name,message } =
            this.borshAccountSchema.decode(buffer);
          return new StudentIntro(name,message);
        } catch (error) {
          console.log("Deserialization error:", error);
          return null;
        }
      }
}