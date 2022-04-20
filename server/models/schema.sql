
CREATE SEQUENCE public.addresses__id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE SEQUENCE public.landlords__id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE TABLE public.landlords (
    _id integer DEFAULT nextval('public.landlords__id_seq'::regclass) NOT NULL,
    overall_rating numeric,
    respect_rating numeric,
    responsiveness_rating numeric,
    is_verified boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    pet_friendly boolean NOT NULL,
    bike_friendly boolean NOT NULL
);


CREATE TABLE public.properties (
    _id integer DEFAULT nextval('public.addresses__id_seq'::regclass) NOT NULL,
    street_num integer,
    street character varying(25),
    city character varying(50) NOT NULL,
    state character varying(25) NOT NULL,
    zip_code integer,
    landlord_id integer,
    latitude numeric,
    longitude numeric
);


CREATE SEQUENCE public.reviews__id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE TABLE public.reviews (
    _id integer DEFAULT nextval('public.reviews__id_seq'::regclass) NOT NULL,
    title character varying(100) NOT NULL,
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


CREATE TABLE public.roles (
    _id integer NOT NULL,
    role character varying(10) NOT NULL
);


CREATE SEQUENCE public.roles__id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles__id_seq OWNED BY public.roles._id;


CREATE TABLE public.user_roles (
    user_id integer NOT NULL,
    role_id integer NOT NULL
);


CREATE SEQUENCE public.users__id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE TABLE public.users (
    _id integer DEFAULT nextval('public.users__id_seq'::regclass) NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(50) NOT NULL,
    password character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    profile_pic character varying(100),
    description character varying(255)
);


ALTER TABLE ONLY public.roles ALTER COLUMN _id SET DEFAULT nextval('public.roles__id_seq'::regclass);


ALTER TABLE ONLY public.properties
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (_id);


ALTER TABLE ONLY public.landlords
    ADD CONSTRAINT landlords_pkey PRIMARY KEY (_id);


ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (_id);


ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (_id);


ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pk0 PRIMARY KEY (user_id, role_id);


ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (_id);


ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT addresses_fk0 FOREIGN KEY (landlord_id) REFERENCES public.landlords(_id);


ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_fk0 FOREIGN KEY (user_id) REFERENCES public.users(_id);


ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_fk1 FOREIGN KEY (landlord_id) REFERENCES public.landlords(_id);


ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_fk0 FOREIGN KEY (user_id) REFERENCES public.users(_id) NOT VALID;


ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_fk1 FOREIGN KEY (role_id) REFERENCES public.roles(_id) NOT VALID;


ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT users_fk0 FOREIGN KEY (landlord_id) REFERENCES public.landlords(_id);
