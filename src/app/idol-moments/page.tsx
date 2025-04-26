'use client';

import { Suspense } from 'react';
import IdolMomentsClientPage from './IdolMomentsClientPage';

export default function IdolMomentsPage() {


    return (
        <Suspense>
            <IdolMomentsClientPage />
        </Suspense>
    );
}

