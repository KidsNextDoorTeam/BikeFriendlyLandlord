CREATE TABLE public.addresses (
    _id integer PRIMARY KEY NOT NULL,
    street_num integer,
    street character varying(25),
    city character varying(50) NOT NULL,
    state character varying(25) NOT NULL,
    zip_code integer,
    landlord_id integer
);
CREATE SEQUENCE public.addresses__id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.landlords (
    _id integer PRIMARY KEY NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    full_name character varying(100) NOT NULL,
    overall_rating numeric,
    respect_rating numeric,
    responsiveness_rating numeric,
    is_verified boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    pet_friendly boolean NOT NULL,
    bike_friendly boolean NOT NULL,
    profile_pic character varying DEFAULT 'userProfile.png'::character varying
);

CREATE SEQUENCE public.landlords__id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.reviews (
    _id integer PRIMARY KEY NOT NULL,
    title character varying(100) NOT NULL,
    username character varying(100) NOT NULL,
    overall_rating numeric,
    respect_rating numeric,
    responsiveness_rating numeric,
    description character varying(1000) NOT NULL,
    user_id integer NOT NULL,
    landlord_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    pet_friendly boolean NOT NULL,
    bike_friendly boolean NOT NULL
);

CREATE SEQUENCE public.reviews__id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
	
CREATE TABLE public.users (
    _id integer PRIMARY KEY NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    full_name character varying(100) NOT NULL,
    username character varying(100) NOT NULL UNIQUE,
    email character varying(50) NOT NULL UNIQUE,
    password character varying(100) NOT NULL,
    is_landlord boolean DEFAULT false,
    landlord_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE public.users__id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
	
ALTER TABLE ONLY public.addresses ALTER COLUMN _id SET DEFAULT nextval('public.addresses__id_seq'::regclass);
ALTER TABLE ONLY public.landlords ALTER COLUMN _id SET DEFAULT nextval('public.landlords__id_seq'::regclass);
ALTER TABLE ONLY public.reviews ALTER COLUMN _id SET DEFAULT nextval('public.reviews__id_seq'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN _id SET DEFAULT nextval('public.users__id_seq'::regclass);

-- FOREIGN KEYS
ALTER TABLE reviews ADD CONSTRAINT "reviews_fk0" FOREIGN KEY ("user_id") REFERENCES users(_id);
ALTER TABLE reviews ADD CONSTRAINT "reviews_fk1" FOREIGN KEY ("landlord_id") REFERENCES landlords(_id);
ALTER TABLE reviews ADD CONSTRAINT "addresses_fk0" FOREIGN KEY ("landlord_id") REFERENCES landlords(_id);
ALTER TABLE reviews ADD CONSTRAINT "users_fk0" FOREIGN KEY ("landlord_id") REFERENCES landlords(_id);
	