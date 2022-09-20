import { BaseModel } from '../../_base/crud';

export class List  {
    id: number;
    title: string;
    value: string;
    description: string;
    status: boolean;

    clear(): void {
        this.id = undefined;
        this.title = '';
        this.value = '';
        this.description = '';
        this.status = false;
	}
}
