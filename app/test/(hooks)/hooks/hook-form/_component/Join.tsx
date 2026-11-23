// 회원가입 컴포넌트

"use client"

import { useForm } from "react-hook-form";

interface FormValues {
    email: string;
    password: string;
    passwordConfirm: string;
    hobbies: string[];
}

export default function Join() {

    const {
        register, handleSubmit, getValues,
        formState: {
            isSubmitting, isSubmitted, errors
        }
    } = useForm<FormValues>({ mode: "onChange" })

    const onSubmit = async (formValues: FormValues) => {
        console.log(formValues)
        // 데이터 통신 (fetch) - react-query
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#])[\da-zA-Z!@#]{8,}$/;

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-2"
            >
                <label className="flex flex-col">
                    <p
                        className="text-[24px] 
                        font-semibold">이메일</p>
                    <input
                        type="text" id="email"
                        className="border rounded-lg w-50 p-2"
                        placeholder="이메일을 입력하세요"
                        {...register("email", {
                            required: true,
                            pattern: {
                                value: emailRegex,
                                message: "유효한 이메일 주소를 입력하세요"
                            }
                        })}
                    />
                    {errors?.email?.type === "required" && (
                        <p className="text-red-500">이메일은 필수 입력 항목입니다.</p>
                    )}
                    {errors?.email?.type === "pattern" && (
                        <p className="text-red-500">유효한 이메일 주소를 입력하세요.</p>
                    )}
                </label>
                <label className="flex flex-col">
                    <p
                        className="text-[24px] 
                        font-semibold">비밀번호</p>
                    <input
                        type="password" id="password"
                        className="border rounded-lg w-50 p-2"
                        placeholder="비밀번호를 입력하세요"
                        {...register("password", {
                            required: true,
                            pattern: {
                                value: passwordRegex,
                                message: "올바른 비밀번호를 입력하세요."
                            }
                        })}
                    />
                    {errors?.password?.type === "required" && (
                        <p className="text-red-500 text-[12px]">비밀번호는 필수 입력 항목입니다.</p>
                    )}
                    {errors?.password?.type === "pattern" && (
                        <p className="text-red-500 text-[12px]">대/소문자, 숫자, 특수문자를 각 하나 포함한 8자리 이상이어야 합니다.</p>
                    )}
                </label>
                <label className="flex flex-col">
                    <p
                        className="text-[24px] 
                        font-semibold">비밀번호 확인</p>
                    <input
                        type="password" id="passwordConfirm"
                        className="border rounded-lg w-50 p-2"
                        placeholder="비밀번호를 다시 입력하세요"
                        {...register("passwordConfirm", {
                            required: true,
                            validate: {
                                matchPassword: (passwordConfirm) => {
                                    const { password } = getValues();
                                    console.log(password, passwordConfirm, password === passwordConfirm);
                                    return password === passwordConfirm || "비밀번호가 일치하지 않습니다.";
                                }
                            }
                        })}
                    />
                    {errors?.passwordConfirm && (
                        <p className="text-red-500 text-[12px]">비밀번호가 일치하지 않습니다.</p>
                    )}
                </label>
                <div className="border border-gray-300">
                    <p className="text-[20px] font-bold">취미</p>
                    <div className="flex gap-2">
                        <label className="flex gap-1">
                            <input type="checkbox" value="soccer" {...register("hobbies")} />
                            <span>축구</span>
                        </label>
                        <label className="flex gap-1">
                            <input type="checkbox" value="basketball" {...register("hobbies")} />
                            <span>농구</span>
                        </label>
                        <label className="flex gap-1">
                            <input type="checkbox" value="baseball" {...register("hobbies")} />
                            <span>야구</span>
                        </label>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-50 h-10 
                    bg-blue-500
                    text-white
                    rounded-2xl
                    mt-5
                    cursor-pointer"
                >{isSubmitting ? "회원가입 중..." : "회원가입"}</button>
            </form>
        </>
    );
}