import os
from pydantic import BaseModel
import aiohttp


class User(BaseModel):
    id: str
    name: str
    created_at: int
    email: str
    password: str


async def loginUser(name: str, email: str, password: str) -> User:
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f'{os.getenv("API_URL","")}/api/v1/user/login',
            data={"name": name, "email": email, "password": password},
        ) as response:
            return await response.json()
