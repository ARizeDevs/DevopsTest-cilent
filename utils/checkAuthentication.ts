import { AuthStore, LoginStatus, useAuthStore } from 'store/AuthStore';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import api from 'data/api';
import { getUserById, getUserTier } from '@/data/user';
import detect from './detect';
import { UserTierEnum } from '@/data/user/types';

export function checkAuthentication(gssp: any) {
    return async (context: any) => {
        const { req, res } = context;
        const jwtToken = req.cookies.authorization;
        detect.isBrowser;
        const jwtPayload: any = jwt.decode(jwtToken);

        const walletAddress: any = jwtPayload?.publicAddress || '';
        let user: any = null;
        let userTier: any = null;

        if (jwtPayload) {
            const result: any = await getUserById(jwtPayload.sub);
            user = result.data;
            userTier =
                UserTierEnum[
                    String(jwtPayload.tier).charAt(0).toUpperCase() + String(jwtPayload.tier).substring(1).toLowerCase()
                ];
        }

        const gsspResult = await gssp(context);
        const result = {};
        _.merge(result, gsspResult, {
            props: {
                hydrationData: {
                    authStore: {
                        user,
                        userTier: userTier || UserTierEnum.NoTier,
                        loginStatus: jwtToken ? LoginStatus.Success : LoginStatus.NotStarted,
                        walletAddress
                    },
                    globalStore: {
                        // ,
                    }
                }
            }
        });

        api.defaults.headers.common.Cookie = `authorization=${jwtToken}`;
        return result;
    };
}
