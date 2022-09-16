import api from '@/data/api';

export const verifyEmail = async (emailAddress: string) => {
    try {
        return api.post('/auth/email-confirmation', { email: emailAddress });
    } catch (error) {
        return error;
    }
};

export const deleteConfirmEmail = () => {
    try {
        return api.delete('/auth/remove-confirmed-email', {});
    } catch (error) {
        return error;
    }
};

export const getUserById = (id: number) => {
    try {
        return api.get(`/users/${id}`);
    } catch (error) {
        return error;
    }
};

export const getUserTier=()=>{
    try {
        return api.get('users/tier/get-tier');
    } catch (error) {
        return
    }
}