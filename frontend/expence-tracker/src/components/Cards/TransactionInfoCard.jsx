import { LuUtensils, LuTrash2, LuTrendingUp, LuTrendingDown, LuPencil } from "react-icons/lu";
import { FaMicrophone } from 'react-icons/fa';
import VoiceCommandAvatar from './VoiceCommandAvatar';
import { getInitials } from '../../../utils/helper';

const TransactionInfoCard = ({
  title,
  icon,
  date,
  amount,
  type,
  hideDeleteBtn,
  onDelete, 
  onEdit
}) => {
  // console.log('TransactionInfoCard - title:', title, 'icon:', icon);

  const getAmountStyles = () =>
    type === "income" ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500";

  return (
    <div className="group relative flex items-center gap-2 sm:gap-4 mt-2 py-2 px-3 sm:p-3 rounded-lg hover:bg-gray-50">
      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-gray-500 bg-gray-100 rounded-full">
        {icon === "VOICE_COMMAND_AVATAR" ? (
          <VoiceCommandAvatar source={title} />
        ) : icon ? (
          <img src={icon} alt={title} className="w-6 h-6" />
        ) : (
          <span className="text-lg font-bold uppercase text-gray-700">
            {console.log('TransactionInfoCard - getInitials for:', title, 'result:', getInitials(title))}
            {getInitials(title)}
          </span>
        )}
      </div>
      <div className="flex-1 flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm text-gray-700 font-medium">{title}</p>
          <p className="text-xxs sm:text-xs text-gray-400 mt-1">{date}</p>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {icon === "VOICE_COMMAND_AVATAR" && onEdit && (
            <button
              className="text-gray-400 hover:text-blue-500 transition-opacity"
              onClick={onEdit}
            >
              <LuPencil size={18} />
            </button>
          )}
          {!hideDeleteBtn && (
            <button
              className="text-gray-400 hover:text-red-500 transition-opacity"
              onClick={onDelete}
            >
              <LuTrash2 size={18} />
            </button>
          )}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyles()}`}
          >
            <h6 className="text-xs font-medium">
              {type === "income" ? "+" : "-"} ₹{amount}
            </h6>
            {type === "income" ? <LuTrendingUp /> : <LuTrendingDown />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionInfoCard;