import { toast } from '@zerodevx/svelte-toast';

export const successToast = (m: string) => {
	toast.push(m, {
		theme: {
			'--toastColor': 'hsl(var(--suc))',
			'--toastBackground': 'hsl(var(--su))',
			'--toastBarHeight': 0
		}
	});
};

export const errorToast = (m: string) => {
	toast.push(m, {
		theme: {
			'--toastColor': 'hsl(var(--erc))',
			'--toastBackground': 'hsl(var(--er))',
			'--toastBarHeight': 0
		}
	});
};
