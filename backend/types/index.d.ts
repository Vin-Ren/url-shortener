import {Request as ExpressRequest} from 'express'


type User = {id: number, email:string} // Without sensitive data.
type Shortener = {id: number, suffix: string, target: string, creatorId: number, hits: number}
type Request = ExpressRequest & {user?:User}
