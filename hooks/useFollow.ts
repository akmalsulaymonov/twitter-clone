import { useCallback, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import useCurrentUser from './useCurrentUser';
import useUser from './useUser';
import useLoginModal from './useLoginModal';

const useFollow = (userId: string) => {
    const { data: currentUser,  mutate: mutateCurrentUser } = useCurrentUser();
    const { mutate: mutateFetchedUser } = useUser(userId);
    
    const LoginModal = useLoginModal();

    const isFollowing = useMemo(() => {
        const list = currentUser?.followingIds || [];

        return list.includes(userId);
    }, [userId, currentUser?.followingIds]);

    const toggleFollow = useCallback( async () => {
        if (!currentUser) {
            return LoginModal.onOpen();
        }

        try {
            let request;

            if (isFollowing) {
                request = () => axios.delete('/api/follow', {data: { userId }});
            } else {
                request = () => axios.post('/api/follow', { userId });
            }
            
            await request();

            mutateCurrentUser();
            mutateFetchedUser();

            toast.success('Success!');
            
        } catch (error) {
            toast.error('Something went wrong!');
        }
    }, [LoginModal, currentUser, isFollowing, userId, mutateCurrentUser, mutateFetchedUser]);

    return { isFollowing, toggleFollow }
};

export default useFollow;