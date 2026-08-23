import React, { useEffect } from 'react';
import { useSubscription } from '@apollo/client/react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { Flame } from 'lucide-react';
import {
  ALERTE_MISE_A_JOUR_SUBSCRIPTION,
  NOUVELLE_ALERTE_SUBSCRIPTION,
} from '../../graphql/operations';
import { useAuthStore } from '../../stores/authStore';

export const RealtimeBridge: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data: nouvelleAlerteData } = useSubscription<any>(NOUVELLE_ALERTE_SUBSCRIPTION, {
    skip: !isAuthenticated,
  });

  useSubscription<any>(ALERTE_MISE_A_JOUR_SUBSCRIPTION, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (!nouvelleAlerteData?.nouvelleAlerte) return;

    const a = nouvelleAlerteData.nouvelleAlerte;
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-[calc(100vw-32px)] sm:w-full bg-red-950 border-2 border-red-500 shadow-2xl rounded-xl pointer-events-auto flex p-3.5 sm:p-4 text-white gap-3 cursor-pointer`}
          onClick={() => {
            toast.dismiss(t.id);
            navigate(`/alertes/${a.id}`);
          }}
        >
          <div className="p-2 bg-red-600 rounded-lg h-fit shrink-0">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-xs sm:text-sm text-red-200 uppercase tracking-wider truncate">
                NOUVEAU SOS SIGNALÉ !
              </span>
              <span className="text-[10px] sm:text-xs bg-red-800 px-2 py-0.5 rounded font-bold shrink-0">
                {a.priorite}
              </span>
            </div>
            <p className="text-xs mt-1 text-red-100 font-medium truncate">
              {a.citoyen.prenom} {a.citoyen.nom} · {a.citoyen.telephone}
            </p>
            {a.adresseApproximative && (
              <p className="text-[11px] text-red-300 truncate mt-0.5">
                📍 {a.adresseApproximative}
              </p>
            )}
          </div>
        </div>
      ),
      { duration: 10000, id: `sos-${a.id}` }
    );
  }, [nouvelleAlerteData, navigate]);

  return null;
};
