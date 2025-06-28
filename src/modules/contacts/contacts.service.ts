import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from '../client/entities/client.entity';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}
  async createContact(createContactDto: CreateContactDto) {
    const { client, ...contactDetails } = createContactDto;
    //Find client
    const selectedClient = await this.clientRepository.findOneBy({
      idClient: client,
    });

    if (!selectedClient) {
      throw new NotFoundException(`The client with id ${client} doesn't exist`);
    }

    //Create contact
    const newContact = await this.contactRepository.create({
      ...contactDetails,
      client: selectedClient,
    });

    //Save the contact entity to the database
    return await this.contactRepository.save(newContact);
  }

  async getAllContacts(
    search?: string,
    showActiveOnly?: boolean,
    limit?: number,
    offset?: number,
  ): Promise<{
    data: Contact[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const take = limit ?? 10;
    const skip = offset ?? 0;

    const queryBuilder = this.contactRepository
      .createQueryBuilder('contact')
      .leftJoinAndSelect('contact.client', 'client')
      .orderBy('contact.createdAt', 'DESC')
      .take(take)
      .skip(skip);

    // Filtro de activos
    if (showActiveOnly !== false) {
      queryBuilder.andWhere('contact.active = :active', { active: true });
    }

    // Filtro de búsqueda
    if (search) {
      queryBuilder.andWhere(
        `(LOWER(contact.name) LIKE :search OR LOWER(contact.phoneNumber) LIKE :search OR LOWER(contact.email) LIKE :search)`,
        { search: `%${search.toLowerCase()}%` },
      );
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, limit: take, offset: skip };
  }

  async getContactsByClient(clientId: string): Promise<Contact[]> {
    const contacts = await this.contactRepository.find({
      where: {
        client: { idClient: clientId },
        active: true,
      },
      relations: ['client'],
    });

    if (!contacts.length) {
      throw new NotFoundException(`No contacts found for client #${clientId}`);
    }

    return contacts;
  }

  async updateContact(
    id: string,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    // Find the contact by id
    const contact = await this.contactRepository.findOne({
      where: { idContact: id, active: true },
      relations: ['client'],
    });

    if (!contact) {
      throw new NotFoundException(`Contact with id ${id} not found`);
    }

    // If client is being updated, validate the new client exists
    if (updateContactDto.client) {
      const newClient = await this.clientRepository.findOneBy({
        idClient: updateContactDto.client,
      });
      if (!newClient) {
        throw new NotFoundException(
          `The client with id ${updateContactDto.client} doesn't exist`,
        );
      }
      contact.client = newClient;
    }

    // Update other fields
    if (updateContactDto.name !== undefined)
      contact.name = updateContactDto.name;
    if (updateContactDto.phoneNumber !== undefined)
      contact.phoneNumber = updateContactDto.phoneNumber;
    if (updateContactDto.email !== undefined)
      contact.email = updateContactDto.email;
    if (updateContactDto.isPrincipalContact !== undefined)
      contact.isPrincipalContact = updateContactDto.isPrincipalContact;
    if (updateContactDto.active !== undefined)
      contact.active = updateContactDto.active;

    // Save and return the updated contact
    return await this.contactRepository.save(contact);
  }

  async softDeleteContact(id: string): Promise<{ message: string }> {
    // Find the contact by id and ensure it is active
    const contact = await this.contactRepository.findOne({
      where: { idContact: id, active: true },
    });

    if (!contact) {
      throw new NotFoundException(
        `Contact with id ${id} not found or already inactive`,
      );
    }

    contact.active = false;
    await this.contactRepository.save(contact);

    return {
      message: `Contact #${id} has been soft deleted (set to inactive).`,
    };
  }
}
