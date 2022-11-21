import Image from 'next/image';
import { useRouter } from 'next/router';
import { BaseResponse } from '../models/baseResponse.model';
import { MessageResponseModel } from '../models/messageResponse.model';
import { TypeQuestionModel } from '../models/typeQuestion.model';
import Loading from './Loading';

interface Props {
  data:
    | BaseResponse<MessageResponseModel | TypeQuestionModel[]>
    | null
    | undefined;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
}

const TypeQuestion = ({ data, isError, isLoading, isSuccess }: Props) => {
  const typeQuestions = data?.data as TypeQuestionModel[];
  const router = useRouter();
  return (
    <div>
      {isError && (
        <div className="w-full h-[80vh] flex items-center justify-center m-auto">
          <h1 className="text-red-500 text-3xl">
            {(data?.data as any)?.message}, please try to refresh
          </h1>
        </div>
      )}
      {isLoading && (
        <div className="w-full h-[80vh] flex items-center justify-center m-auto">
          <Loading size="medium" />
        </div>
      )}
      {isSuccess && data?.success && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 p-5 gap-5">
          {typeQuestions.map((val, index) => (
            <div
              key={`type_question_${val.id}_${index}`}
              className="w-full bg-gray-600 h-16 rounded grid grid-cols-3 items-center px-2 group hover:bg-gray-500 cursor-pointer"
              onClick={() => router.push(`/quiz/${val.id}`)}
            >
              <div className="w-12 h-12 col-span-1">
                <Image
                  src={
                    val.photo && val.photo !== ''
                      ? val.photo
                      : '/assets/images/no_image_available.png'
                  }
                  alt={val.type}
                  className="w-full h-full rounded-full shadow-md"
                  priority
                  object-fit="contain"
                  width={50}
                  height={50}
                />
              </div>
              <div className="col-span-2">
                <p className="font-semibold text-lg text-gray-300 group-hover:text-gray-200">
                  {val.type}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TypeQuestion;
